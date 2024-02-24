import { createContext, ReactNode, useState, useEffect } from 'react';
import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';
import { storageUserSave, storageUserGet } from '@storage/storageUser'; 

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email:string,password:string) => Promise<void>; 
  isLoadingUserStorageData: boolean;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps); 

type AuthContextProviderProps = {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps ) {
  
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  const [user,setUser] = useState<UserDTO>({} as UserDTO);

  async function signIn(email:string,password:string){
    try {
      const { data } = await api.post('/sessions',{email,password});

      if (data.user) {
        setUser(data.user);
        storageUserSave(data.user);
      }
  
    } catch(error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet();

      if (userLogged){
        setUser(userLogged);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }  

  useEffect(()=>{
    loadUserData();
  },[]);

  return(
    <AuthContext.Provider value={{ user, signIn, isLoadingUserStorageData }}>
         {children }
    </AuthContext.Provider>    
  )
}
