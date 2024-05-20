import React, { createContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { GoogleLogin } from '@react-oauth/google';
// Crie o contexto de autenticação
export const AuthContext = createContext();

// Defina o AuthProvider para fornecer o contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getGoogleAuth = async (accessToken) => {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`);
      const data = await response.json();
      if (data.aud === import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID) {
        setIsAuthenticated(true);
      } else {
        Cookies.remove('access_token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      getGoogleAuth(token);
    } else {
      setLoading(false);
    }
    // Simule uma chamada de autenticação (ex. uma chamada a uma API)
    // const authenticateUser = async () => {
    //   try {
    //     const response = await fetch('https://api.seusite.com/auth/status', {
    //       method: 'GET',
    //       credentials: 'include', // Inclua cookies na requisição se necessário
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     });

    //     if (response.ok) {
    //       const result = await response.json();
    //       setIsAuthenticated(result.isAuthenticated); // Supondo que a resposta tenha um campo isAuthenticated
    //     } else {
    //       setIsAuthenticated(false);
    //     }
    //   } catch (error) {
    //     console.error('Failed to authenticate:', error);
    //     setIsAuthenticated(false);
    //   } finally {
    //     setLoading(false);
    //   }
    // };


  }, []);

  return (
    <AuthContext.Provider value={{ loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};