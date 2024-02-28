import React, { useState } from 'react';

import { TouchableOpacity, Alert } from 'react-native';

import {
  VStack,
  Text,
  ScrollView,
  Center,
  Skeleton,
  Heading,
  useToast,
} from 'native-base';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { useAuth } from '@hooks/useAuth';

import defaultUserPhotoImg from '@assets/img/userPhotoDefault.png';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  password: yup
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres.')
    .nullable()
    .transform(value => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform(value => (!!value ? value : null))
    .oneOf([yup.ref('password'), null], 'As senhas não coincidem.')
    .when('password', {
      is: (Field: any) => Field,
      then: schema =>
        schema
          .nullable()
          .required('Confirme a nova senha.')
          .transform(value => (!!value ? value : null)),
    }),
});

const PHOTO_SIZE = 33;

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
  );
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleUserSelectPhoto() {
    setPhotoIsLoading(true);
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita que sua aplicação acesses as imagens do seu dispositivo.'
        );
      } else {
        const photoSelected = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          aspect: [4, 4],
          allowsEditing: true,
        });

        if (photoSelected.canceled) {
          return;
        }

        if (photoSelected.assets[0].uri) {
          const photoInfo = await FileSystem.getInfoAsync(
            photoSelected.assets[0].uri
          );

          if (photoInfo.exists && photoInfo.size > 5000000) {
            return toast.show({
              title: 'A imagem é muito grande, tente outra menor que 5MB',
              bgColor: 'red.500',
              rounded: 'md',
            });
          }

          const fileExtension = photoSelected.assets[0].uri.split('.').pop();

          const photoFile = {
            name: `${user.name}.${fileExtension}`.toLowerCase(),
            uri: photoSelected.assets[0].uri,
            type: `${photoSelected.assets[0].type}/${fileExtension}}`,
          } as any;

          const userPhotoUploadForm = new FormData();
          userPhotoUploadForm.append('avatar', photoFile);

          const avatarUpdatedResponse = await api.patch(
            '/users/avatar',
            userPhotoUploadForm,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          const userUpdated = user;
          userUpdated.avatar = avatarUpdatedResponse.data.avatar;
          await updateUserProfile(userUpdated);

          toast.show({
            title: 'Foto de perfil atualizada com sucesso!',
            placement: 'top',
            bgColor: 'green.500',
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put('/users', data);

      await updateUserProfile(userUpdated);

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Erro ao atualizar perfil. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView _contentContainerStyle={{ pb: 9 }}>
        <Center
          mt={6}
          px={10}
        >
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
            />
          ) : (
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultUserPhotoImg
              }
              alt="Foto de perfil"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserSelectPhoto}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Center>

        <VStack
          px={10}
          mt={12}
        >
          <Heading
            color="gray.200"
            fontSize="md"
            mb={2}
            fontFamily="heading"
          >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                onChangeText={onChange}
                placeholder="Senha atual"
                secureTextEntry
                errorMessage={errors.old_password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                onChangeText={onChange}
                placeholder="Nova senha"
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                onChangeText={onChange}
                placeholder="Confirmar nova senha"
                secureTextEntry
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            isLoading={isUpdating}
            onPress={() => handleSubmit(handleProfileUpdate)()}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
