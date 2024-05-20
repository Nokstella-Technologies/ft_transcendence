import React from 'react';
import { AuthProvider } from './context/AuthContex';
import AppRoutes from './routes';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  const googleClientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider >
          <AppRoutes />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;