import { useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from '@hooks/useAuth'; 
import { AppError } from '@utils/AppError';

export function SignIn() {

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail ] = useState('ssilman@gmail.com');
  const [password, setPassword ] = useState('123456');  

  const { signIn } = useAuth();

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const toast = useToast();

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  async function handleSignIn() {
    console.log("email", email);
    console.log("password", password);

    // setUser({
    //   id: '',
    //   name: '',
    //   email, 
    //   avatar: '',
    // });

    try {
      setIsLoading(true);
      await signIn(email,password);
    } catch(error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possivel entrar. Tente novamente mais tarde.';
      
      setIsLoading(false);
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <VStack flex={1} px={10} pb={16}>
        <Image 
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo.
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Acesse a conta
          </Heading>

          <Input 
            placeholder="E-mail" 
            onChangeText={setEmail}
            keyboardType="email-address"
            value="ssilman@gmail.com"
            autoCapitalize="none"

          />
          <Input 
            placeholder="Senha" 
            onChangeText={setPassword}
            value="123456"
            secureTextEntry
          />

          <Button 
            title="Acessar" 
            onPress={handleSignIn}
            isLoading={isLoading}
          />

        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <Button 
            title="Criar Conta" 
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}