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

// Kỹ thuật Inject Store: truyền store vào file JS thuần authorizeAxios.js
import { injectStore } from '~/utils/authorizeAxios'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store} >
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: {
                maxWidth: 'xs',
                fullWidth: true,
                PaperProps: {
                  sx: { borderRadius: 3, p: 1, backgroundImage: 'none' }
                }
              },
              titleProps: {
                sx: { fontWeight: 700, fontSize: '1.15rem', pb: 1 }
              },
              dialogActionsProps: {
                sx: { px: 3, pb: 2, gap: 1 }
              },
              cancellationButtonProps: {
                variant: 'outlined',
                color: 'inherit',
                sx: { borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.5, borderColor: 'divider' }
              },
              confirmationButtonProps: {
                variant: 'contained',
                color: 'error',
                disableElevation: true,
                sx: { borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.5 }
              }
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
