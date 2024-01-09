import { api } from '@services/api';

import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';

import LogoSvr from '@assets/logo.svg';

import BackgroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import axios from 'axios';
import { AppError } from '@utils/AppError';



type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string; 
}

export function SignUp(){

  const toast = useToast();

  const [name, setName ] = useState('');
  const [email, setEmail ] = useState('');
  const [password, setPassword ] = useState('');
  const [passwordConfirm, setPasswordConfirm ] = useState('');

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp() {

    try{
      const response = await api.post('/users',{ name, email, password });
      console.log(response.data);
    } catch (error) {
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : 'Não foi possível criar a conta'
        
        toast.show({
          title,  
          placement: 'top',
          bgColor: 'red.500'
        });

      // if (axios.isAxiosError(error)){
      //    Alert.alert(error.response?.data.message);
      //   // Alert.alert(title);
      // }
    }

    // const response = await api.post('/users',{ name, email, password });
    // console.log(response.data);

    // const response = await fetch('http://192.168.0.110:3333/users', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ name, email, password })
    // });
    // // .then(response => response.json())
    // // .then(data => console.log(data))

    // const data = await Response.json();
    // console.log(data);
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
          Crie sua conta
        </Heading>

        <Input 
          placeholder='Nome'
          onChangeText={setName}
          rules={{
            required:'Informe o nome.'
          }}
        />

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

        <Input 
          placeholder='Confirmar a Senha'
          onChangeText={setPasswordConfirm}
          secureTextEntry
          returnKeyType="send"
        />

        <Button 
          title="Criar e Acessar"
          onPress={handleSignUp}
        ></Button>

      </Center>


      <Button 
        mt={18}
        title="Voltar para o Login"
        variant="outline"
        onPress={handleGoBack}
      ></Button>


    </VStack>
    </ScrollView>    
  );
}