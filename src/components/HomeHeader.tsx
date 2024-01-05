import { HStack, VStack, Text, Heading, Icon } from "native-base";
import { MaterialIcons } from '@expo/vector-icons';
import { UserPhoto } from "./UserPhoto";
import { TouchableOpacity } from "react-native";
import { useAuth } from '@hooks/useAuth';
import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

export function HomeHeader(){

  const { user, signOut } = useAuth();


  return(
    
    <HStack 
      bg="gray.600" 
      pt={16} 
      pb={5} 
      px={8} 
      alignItems="center"
    >

      <UserPhoto
        source={user.avatar ?  { uri: user.avatar } : defaultUserPhotoImg }
        size={16}
        alt=""
        mr={4}
      />      

      <VStack flex={1}>
        
        <Text 
          color="gray.100"
          fontSize="md"
        >Ola</Text>

        <Heading 
          color="gray.100"
          fontSize="md"          
        >{user.name}</Heading>

      </VStack>

      <TouchableOpacity
        onPress={signOut}
      >

        <Icon 
          as={MaterialIcons}
          name="logout"
          color="gray.200" 
          size={7}     
        />

      </TouchableOpacity>

    </HStack>
  )
}