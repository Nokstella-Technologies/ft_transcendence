import React from 'react';
import { AuthProvider } from './context/AuthContex';
import AppRoutes from './routes';

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;