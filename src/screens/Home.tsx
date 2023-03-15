import { HomeHeader } from '@components/HomeHeader';
import { VStack, Text, HStack, FlatList, Heading } from 'native-base';
import { Group } from '@components/Group';
import { useState } from 'react';
import { ExerciseCard } from '@components/ExerciseCard';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';


export function Home() {

  const [groups, setGroups]= useState(['costa','bíceps','tríceps','ombro'])
  const [exercises, setExercises]= useState(['Puxada frontal','Remada curvada','Remada unilateral','Levantamento terras'])
  const [groupSelected,setGroupSelected] = useState('costa');

  const navigation= useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails(){
    navigation.navigate('exercise');
  }

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Group 
          name={item} 
          isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
          onPress={()=> setGroupSelected(item)}
          />          
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{px:8}}
        my={10}
        maxH={10}
        minH={10}
       
      />

      <VStack flex={1} px={8}>

        <HStack
          justifyContent="space-between"
          mb={5}
        >
          <Heading
            color="gray.200"
            fontSize="md"
          >
            Exercícios
          </Heading>

          <Text
            color="gray.200"
            fontSize="sm"
          >
            {exercises.length}
          </Text>

        </HStack>

        {/* <ExerciseCard />     
        <ExerciseCard />      */}

        <FlatList
          data={exercises}
          keyExtractor={item => item}
          renderItem={({item}) => ( 
            <ExerciseCard 
              onPress={handleOpenExerciseDetails}
            /> ) }
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            paddingBottom: 20
          }}
        />

      </VStack>




      {/* <HStack >

        <Group 
          name="costa" 
          isActive={groupSelected === "costa"}
          onPress={()=> setGroupSelected("costa")}
        />

        <Group 
          name="ombro" 
          isActive={groupSelected === "ombro"}
          onPress={()=> setGroupSelected("ombro")}
        />

      </HStack> */}

    </VStack>
  )
}