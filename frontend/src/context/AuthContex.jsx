import React, { createContext, useState, useEffect } from 'react';

// Crie o contexto de autenticação
export const AuthContext = createContext();

// Defina o AuthProvider para fornecer o contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simule uma chamada de autenticação (ex. uma chamada a uma API)
    const authenticateUser = async () => {
      try {
        // Aqui você pode fazer a chamada a uma API para verificar a autenticação
        // Exemplo:
        // const response = await fetch('/api/auth/check');
        // const result = await response.json();
        // setIsAuthenticated(result.isAuthenticated);

        // Simulando uma chamada de autenticação com um timeout
        setTimeout(() => {
          setIsAuthenticated(false); // Defina isso com base na lógica real de autenticação
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to authenticate:', error);
        setLoading(false);
      }
    };

    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};