import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App'
import { ThemeProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'

// Cấu hình redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'

// Cấu hình react-router-dom với browserRouter
import { BrowserRouter } from 'react-router-dom'

// Cấu hình Redux-Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store} >
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              confirmationButtonProps: { color: 'error', variant: 'outlined' },
              cancellationButtonProps: { color: 'inherit' }
            }}
          >
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-right' theme='colored'/>
          </ConfirmProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
