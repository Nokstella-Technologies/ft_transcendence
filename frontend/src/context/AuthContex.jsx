import React, { createContext, useState, useEffect } from 'react';
import Cookies from "js-cookie";
// Crie o contexto de autenticação
export const AuthContext = createContext();

// Defina o AuthProvider para fornecer o contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");


  const validateToken42 = async (token) => {
    try {
      const response = await fetch(`https://api.intra.42.fr/v2/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
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
  }

  const getGoogleAuth = async (accessToken) => {
    try {
      console.log("googlAuth", accessToken)
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`);
      const data = await response.json();
      if (data.aud === import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID) {
        setIsAuthenticated(true);
      } else {
        Cookies.remove('auth_token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      validateToken42(accessToken);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const validateLogin  = async (code) => {
      getGoogleAuth(code);
  }

  
  const login = async ({ email, password }) => {
    try {
      const response = await fetch('s/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.token) {
        Cookies.set('auth_token', data.token, { sameSite: 'Lax', secure: true });
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const register = async ({ email, password }) => { 

  }


  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token !== undefined) {
      validateLogin(token);
    } else {
      setLoading(false);
    }

    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const state = queryParams.get('state');

    if (code && state) {
      window.opener.postMessage({ code }, window.location.origin);
      window.close();
    } else {
      setError('Invalid login attempt');
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


  }, [location, setLoading, setIsAuthenticated, setError]);

  return (
    <AuthContext.Provider value={{ loading, isAuthenticated, login , register}}>
      {children}
    </AuthContext.Provider>
  );
};