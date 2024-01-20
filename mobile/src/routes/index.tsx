import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useContext } from 'react';

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

import { AuthContext } from '@contexts/AuthContext';

export function Routes() {
  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  const contextData = useContext(AuthContext);
  console.log("USUARIO LOGADO=>", contextData) 

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  );
}