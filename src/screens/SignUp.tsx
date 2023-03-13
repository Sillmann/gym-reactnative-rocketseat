import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base';

import LogoSvr from '@assets/logo.svg';

import BackgroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function SignUp(){

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
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
        />

        <Input 
          placeholder='E-mail'
          keyboardType="email-address"
          autoCapitalize="none"
        />            

        <Input 
          placeholder='Senha'
          secureTextEntry
        />

        <Button title="Criar e Acessar"></Button>

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