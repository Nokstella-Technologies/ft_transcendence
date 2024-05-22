import { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import BackgroundAnimation from '../../components/backgroundAnimation/backgroundAnimation'
import SoundControl from '../../components/soundControl'
import Music from '../../assets/sounds/music.m4a'
import Container from '../../components/containers'
import Input from '../../components/input/input'
import { AuthContext } from '../../context/AuthContex'
import Button from '../../components/button'
import { Link } from 'react-router-dom'
import './index.css'

function SignUp() {
  const { register } = useContext(AuthContext); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const navigate = useNavigate()
 
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmedPassword) {
      register({ name, email, password });
    }
  };


  return (
      <div className="login">
        <BackgroundAnimation/>
        <SoundControl audioSrc={Music}/>
        <Container className="login-container"  title="Pong Cadastro">
          <form className='form-login' onSubmit={handleFormSubmit}>
            
            <Input type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)}/>
            <Input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            <Input type="password" placeholder="Senha"  onChange={(e) => setPassword(e.target.value)}/>
            <Input type="password" placeholder="Confime a Senha"  onChange={(e) => setConfirmedPassword(e.target.value)}/>
            <Button type="submit">Cadastrar</Button>
          </form>
          <p className="register-link" >Já tem uma conta? <Link to="/login">Login</Link></p>
        </Container>
     </div>
  )
}

export default SignUp
