import { useContext, useEffect, useState } from 'react'
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
import { AuthContext } from '../../context/AuthContex'

function Login() {
  const [type, setType] = useState('google');
  const { login } = useContext(AuthContext); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const clientID = import.meta.env.VITE_42_CLIENT_ID
  const redirect = import.meta.env.VITE_REDIRECT_PAGE_AFTER_LOGIN
  const state = uuidv4()
 
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Envie os dados do formulário para o AuthContext
    login({ email, password });
  };

  const handleLoginSuccess = (response) => {
    const {credential } = response;
    console.log('Login Success:', response);
    Cookies.set("auth_token", credential, { sameSite: 'Lax', secure: true });
    navigate('/home');
    if (window.opener) {
      window.opener.postMessage({ credential }, window.location.origin);
      window.close();
      setType('google');
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
      const { code } = event.data;
      if (code) {
        const res = { credential: code };
        handleLoginSuccess(res);
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
      setType('42');
      window.open(authUrl, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
  }

  return (
      <div className="login">
        <BackgroundAnimation/>
        <SoundControl audioSrc={Music}/>
        <Container className="login-container"  title="Login">
          <form className='form-login' onSubmit={handleFormSubmit}>
            <Input type="email" placeholder="Email"  onChange={(e) => setEmail(e.target.value)}/>
            <Input type="password" placeholder="Senha"  onChange={(e) => setPassword(e.target.value)}/>
            <Button type="submit">Login</Button>
            <Button className="google-login" onClick={loginGoogle}>Login com Google</Button>
            <Button  className="a42-login" onClick={login42}>Login com 42</Button>
          </form>
          <p className="register-link" >Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
        </Container>
     </div>
  )
}

export default Login
