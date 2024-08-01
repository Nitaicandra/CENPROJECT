import React, { useState, useContext } from 'react'
import { useNavigate, Navigate } from 'react-router-dom';

import loginService from '../services/login'
import LoginForm from '../components/LoginForm'
import Alert from '../components/Alert'
import { UserContext } from '../components/UserContext';


const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [alertType, setAlertType] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')

  const { user, loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
      loginUser(user);
      setUsername('')
      setPassword('')
      navigate('/home')
    } catch (exception) {
      setErrorMessage('Error: Wrong credentials')
      setAlertType('alert-error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return(
      <div>
        <Alert message={errorMessage} type={alertType} />
        <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
      </div>
    )
  }

  return (
    <div>
      {user === null ?
        loginForm() :
        <Navigate to="/home" />
      }
    </div>
  )
}

export default Login
