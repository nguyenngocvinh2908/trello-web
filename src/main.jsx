import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App'
import { ThemeProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
    <ToastContainer position='bottom-right' theme='colored'/>
  </ThemeProvider>
)
