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
        const response = await fetch('https://api.seusite.com/auth/status', {
          method: 'GET',
          credentials: 'include', // Inclua cookies na requisição se necessário
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          setIsAuthenticated(result.isAuthenticated); // Supondo que a resposta tenha um campo isAuthenticated
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to authenticate:', error);
        setIsAuthenticated(false);
      } finally {
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