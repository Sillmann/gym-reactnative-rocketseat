import { Text } from 'native-base';

export function SectionListEmpty() {
  return (
    <Text
      color="gray.100"
      textAlign="center"
    >
      Não há exercícios registrados ainda. {'\n'}
      Que tal praticarmos um exercício?
    </Text>
  );
}
