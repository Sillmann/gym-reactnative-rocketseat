import React, { useEffect, useState } from 'react';

import { TouchableOpacity } from 'react-native';

import {
  HStack,
  Icon,
  VStack,
  Heading,
  Text,
  Image,
  Box,
  ScrollView,
  useToast,
} from 'native-base';

import { Feather } from '@expo/vector-icons';

import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import { ExerciseDTO } from '@dtos/ExerciseDTO';

import BodySvg from '@assets/svg/body.svg';
import SeriesSvg from '@assets/svg/series.svg';
import RepetitionsSvg from '@assets/svg/repetitions.svg';

import { Loading } from '@components/Loading';
import { Button } from '@components/Button';

type RouteParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sendingRegister, setSendingRegister] = useState<boolean>(false);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();

  const { exerciseId } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);

      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os detalhes do exercício';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMarkAsDoneExercise() {
    try {
      setSendingRegister(true);

      await api.post('/history', { exercise_id: exerciseId });

      toast.show({
        title: 'Exercício marcado como realizado',
        placement: 'top',
        bgColor: 'green.700',
      });

      navigation.navigate('history');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível marcar o exercício como realizado';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setSendingRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack
        px={8}
        bg="gray.600"
        pt={12}
      >
        <TouchableOpacity onPress={handleGoBack}>
          <Icon
            as={Feather}
            name="arrow-left"
            size={6}
            color="green.500"
          />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt={4}
          mb={8}
        >
          <Heading
            color="gray.100"
            fontSize="lg"
            fontFamily="heading"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text
              color="gray.200"
              ml={1}
              textTransform="capitalize"
            >
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView
          _contentContainerStyle={{
            pb: 8,
          }}
          showsVerticalScrollIndicator={false}
        >
          <VStack p={8}>
            <Box
              rounded="lg"
              mb={3}
              overflow="hidden"
            >
              <Image
                w="full"
                h={80}
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
                alt={`Gif de como realizar o ${exercise.name}`}
                resizeMode="cover"
              />
            </Box>

            <Box
              bg="gray.600"
              rounded="md"
              pb={4}
              px={4}
            >
              <HStack
                justifyContent="space-around"
                my={6}
              >
                <HStack alignItems="center">
                  <SeriesSvg />

                  <Text
                    color="gray.200"
                    ml={2}
                  >
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack alignItems="center">
                  <RepetitionsSvg />

                  <Text
                    color="gray.200"
                    ml={2}
                  >
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                title="Marcar como realizado"
                isLoading={sendingRegister}
                onPress={handleMarkAsDoneExercise}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
}
