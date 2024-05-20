import { useEffect, useState } from 'react'
import BackgroundAnimation from '../../components/backgroundAnimation/backgroundAnimation'
import Container from '../../components/containers'
import Music from "../../assets/sounds/music.m4a"
import Button from '../../components/button'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/input/input'
import Cookies from 'js-cookie'
import './index.css'
import SoundControl from '../../components/soundControl/'
import { useGoogleLogin } from '@react-oauth/google'
import { v4 as uuidv4 } from 'uuid';

function Login() {
  const [type, setType] = useState('google');
  const navigate = useNavigate();
  const clientID = import.meta.env.VITE_REDIRECT_PAGE_AFTER_LOGIN
  const redirect = import.meta.env.VITE_REDIRECT_PAGE_AFTER_LOGIN
  const clientSecret = import.meta.env.VITE_42_CLIENT_SECRET;
  const state = uuidv4()
 

  const handleLoginSuccess = (response) => {
    const {credential } = response;
    console.log('Login Success:', response);
    Cookies.set("auth_token", credential, { sameSite: 'Lax', secure: true });
    navigate('/home');
    if (window.opener) {
      window.opener.postMessage({ credential }, window.location.origin);
      window.close();
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginFailure,
  });

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin || type === 'google' ) return;  
      if (code) {
        console.log('Received code:', code);
        const res = { credential: access_token };
        handleLoginSuccess(res);
        setType('google');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, type, setType]);

  const login42 = () => {
      const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&state=${state}`;
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      window.open(authUrl, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
      setType('42');
  }

  return (
      <div className="login">
        <BackgroundAnimation/>
        <SoundControl audioSrc={Music}/>
        <Container className="login-container"  title="Login">
          <form className='form-login'>
            <Input type="email" placeholder="Email"/>
            <Input type="password" placeholder="Senha"/>
            <Button>Login</Button>
            <Button className="google-login" onClick={loginGoogle}>Login com Google</Button>
            <Button  className="a42-login" onClick={login42}>Login com 42</Button>
          </form>
          <p className="register-link" >Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
        </Container>
     </div>
  )
}

export default Login
