import React from 'react'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import authBg from '~/assets/auth/auth-bg.svg?url'

function Auth () {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${authBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      px: 2,
      py: 4
    }}>
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  )
}

export default Auth