import React from 'react';
import {  useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Button from '../button';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

 

  const handleLoginSuccess = (response) => {
    console.log("executou")
    console.log(response)
    Cookies.set("authToken", response.credential);
    navigate('/home');
    // Enviar o token ao backend para verificação e autenticação
    // fetch('https://api.seusite.com/auth/google', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ token: response.credential })
    // })
    // .then(res => res.json())
    // .then(data => {
    //   if (data.success) {
    //     // Armazenar o token ou dados do usuário conforme necessário
    //     localStorage.setItem('authToken', data.token);
    //     navigate('/home'); // Redirecionar para a rota protegida
    //   } else {
    //     // Tratar erros de autenticação
    //     console.error('Failed to authenticate');
    //   }
    // })
    // .catch(error => console.error('Error:', error));
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginFailure,
  });

  return (
    <>
    <Button className="google-login" onClick={login}>
        Login com Google</Button>
    </>
  );
};

export default GoogleLoginButton;