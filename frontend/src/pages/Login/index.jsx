import { useState } from 'react'
import BackgroundAnimation from '../../components/backgroundAnimation/backgroundAnimation'
import Container from '../../components/containers'
import Music from "../../assets/sounds/music.m4a"
import Button from '../../components/button'
import { Link } from 'react-router-dom'
import Input from '../../components/input/input'
import './index.css'
import SoundControl from '../../components/soundControl/'
import GoogleLoginButton from '../../components/googleButton'
function Login() {
  const [count, setCount] = useState(0)

  return (
      <div className="login">
        <BackgroundAnimation/>
        <SoundControl audioSrc={Music}/>
        <Container className="login-container"  title="Login">
          <form className='form-login'>
            <Input type="email" placeholder="Email"/>
            <Input type="password" placeholder="Senha"/>
            <Button>Login</Button>
            <GoogleLoginButton/>
            <Button  className="a42-login">Login com 42</Button>
          </form>
          <p className="register-link" >Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
        </Container>
     </div>
  )
}

export default Login
