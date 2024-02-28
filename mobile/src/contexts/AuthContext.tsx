import { useState, useEffect, createContext } from 'react';

import { api } from '@services/api';

import {
  storageUserGet,
  storageUserSave,
  storageUserRemove,
} from '@storage/storageUser';
import {
  storageAuthTokenSave,
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from '@storage/storageAuthToken';

import { UserDTO } from '@dtos/userDTO';

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
  isLoadingUserStorage: boolean;
};

type UserAndTokenProps = {
  userData: UserDTO;
  token: string;
  refresh_token: string;
};

type UpdateUserProps = {
  userUpdated: UserDTO;
  token: string;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorage, setIsLoadingUserStorage] = useState(true);

  // Atualiza o usuário e o token
  async function UserAndTokenUpdate({ userUpdated, token }: UpdateUserProps) {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userUpdated);
    } catch (error) {
      throw error;
    }
  }

  // Salva o usuário e o token no storage do dispositivo
  async function storageUserAndTokenSave({
    userData,
    token,
    refresh_token,
  }: UserAndTokenProps) {
    try {
      setIsLoadingUserStorage(true);

      // Precisa o await pois são duas funções assíncronas
      await storageUserSave(userData);
      await storageAuthTokenSave({ token, refresh_token });
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorage(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password });

      if ((data.user && data.token, data.refresh_token)) {
        await storageUserAndTokenSave({
          userData: data.user,
          token: data.token,
          refresh_token: data.refresh_token,
        });

        await UserAndTokenUpdate({ userUpdated: data.user, token: data.token });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorage(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorage(true);

      setUser({} as UserDTO);

      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorage(false);
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
    } catch (error) {
      throw error;
    }
  }

  async function loadStorageData() {
    try {
      setIsLoadingUserStorage(true);

      const userLogged = await storageUserGet();
      const { token } = await storageAuthTokenGet();

      if (token && userLogged) {
        UserAndTokenUpdate({ userUpdated: userLogged, token: token });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorage(false);
    }
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => subscribe();
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, updateUserProfile, isLoadingUserStorage }}
    >
      {children}
    </AuthContext.Provider>
  );
}
