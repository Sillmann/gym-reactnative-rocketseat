import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserDTO } from '@dtos/userDTO';

import { USER_STORAGE } from '@storage/storageConfig';

export async function storageUserSave(user: UserDTO) {
  // O uso do stringify é necessário para converter o objeto em string que inicialmente vem no formato de objeto
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageUserGet() {
  // O uso do parse é necessário para converter a string em objeto
  const user = await AsyncStorage.getItem(USER_STORAGE);
  return user ? (JSON.parse(user) as UserDTO) : null;
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE);
}
