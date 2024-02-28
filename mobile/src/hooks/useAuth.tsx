import { useContext } from 'react';

import { AuthContext } from '@contexts/AuthContext';

export function useAuth() {
  // Compartilhar dados sem precisar passar por props em todos os componentes
  const context = useContext(AuthContext);

  return context;
}
