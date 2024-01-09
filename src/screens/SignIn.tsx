import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import LogoSvr from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { useState } from 'react';

import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';

export function SignIn(){

  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();

  const [email, setEmail ] = useState('');
  const [password, setPassword ] = useState('');

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const toast = useToast();

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  async function handleSignIn() {
    try {
      setIsLoading(true);
      await signIn(email,password);
     
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possivel acessar.'
      setIsLoading(false);
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

    }
  }

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
    >
    <VStack flex={1} px={10} pb={10}>
      <Image
        source={BackgroundImg}
        defaultSource={BackgroundImg}
        alt=""
        resizeMode="contain"
        position="absolute"
      />  

      <Center my={'20'}>
        <LogoSvr/>

        <Text color="gray.100" fontSize="sm">
          Treine sua mente e seu corpo</Text>

      </Center>

      <Center>

        <Heading 
          color="gray.100" 
          fontSize="xl"
          mb={8}
          fontFamily="heading"
        >
          Acesse sua conta
        </Heading>

        <Input 
          placeholder='E-mail'
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />               

        <Input 
          placeholder='Senha'
          onChangeText={setPassword}
          secureTextEntry
        />        

        <Button 
          title="Acessar"
          onPress={handleSignIn}
          isLoading={isLoading}
        ></Button>

      </Center>

      <Center mt={24}>
        <Text 
          color="gray.100" 
          fontSize="sm" 
          mb={3}
          fontFamily="body"
        >
          Ainda não tem acesso ?
        </Text>
      </Center>

      <Button 
        title="Criar Conta"
        variant="outline"
        onPress={handleNewAccount}
      ></Button>

    </VStack>
    </ScrollView>    
  );
}