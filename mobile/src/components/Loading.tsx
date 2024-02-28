import { Spinner, Center, Text } from 'native-base';

export function Loading() {
  return (
    <Center
      flex={1}
      bg="gray.700"
    >
      <Spinner
        size={26}
        color="green.500"
        mb={4}
      />
      <Text>Carregando...</Text>
    </Center>
  );
}
