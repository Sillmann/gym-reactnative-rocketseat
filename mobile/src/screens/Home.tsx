import React, { useState, useEffect, useCallback } from 'react';

import { HStack, VStack, FlatList, Text, Heading, useToast } from 'native-base';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { api } from '@services/api';

import { ExerciseDTO } from '@dtos/ExerciseDTO';

import { AppError } from '@utils/AppError';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';
import { Loading } from '@components/Loading';
import { ExerciseCard } from '@components/ExerciseCard';

export function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState<string>('antebraço');
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);

  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenDetailsExercise(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId });
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);
      const response = await api.get('/groups');

      setGroups(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos de exercícios';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchExercises() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);

      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os exercícios';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExercises();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={
              groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()
            }
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{
          px: 8,
        }}
        my={10}
        maxH={10}
        minH={10}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack
          flex={1}
          px={8}
        >
          <HStack
            justifyContent="space-between"
            alignItems="center"
            mb={5}
          >
            <Heading
              color="gray.200"
              fontSize="md"
              fontFamily="heading"
            >
              Exercícios
            </Heading>

            <Text
              color="gray.200"
              fontSize="md"
            >
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                data={item}
                onPress={() => handleOpenDetailsExercise(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              pb: 10,
            }}
          />
        </VStack>
      )}
    </VStack>
  );
}
