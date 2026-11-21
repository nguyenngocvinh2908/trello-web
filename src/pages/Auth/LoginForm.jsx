import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import SvgIcon from '@mui/material/SvgIcon'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const submitLogIn = (data) => {
    // Dữ liệu { email, password } đã vượt qua validation
    // console.log('submitLogIn data:', data)
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard
          sx={{
            minWidth: { xs: 340, sm: 380 },
            maxWidth: 400,
            marginTop: '1em',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(9, 30, 66, 0.25)'
          }}
        >
          {/* Header: Icon khóa & Logo Trello */}
          <Box
            sx={{
              margin: '1em',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <LockIcon />
            </Avatar>
            <SvgIcon
              component={TrelloIcon}
              inheritViewBox
              sx={{ color: 'primary.main', fontSize: 34 }}
            />
          </Box>

          <Box
            sx={{
              marginTop: '0.5em',
              display: 'flex',
              justifyContent: 'center',
              color: (theme) => theme.palette.grey[600]
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Log in to continue to Trello
            </Typography>
          </Box>

          {/* Thông báo trạng thái từ URL (sau khi đăng ký hoặc xác thực email) */}
          <Box
            sx={{
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 1em',
              gap: 1
            }}
          >
            {verifiedEmail && (
              <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Your email&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
                  {verifiedEmail}
                </Typography>
                &nbsp;has been verified.<br />You can now log in to use the service!
              </Alert>
            )}

            {registeredEmail && (
              <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                A verification email has been sent to&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
                  {registeredEmail}
                </Typography>
                <br />Please check your inbox and verify your account before logging in!
              </Alert>
            )}
          </Box>

          {/* Các trường nhập liệu Email & Password */}
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName='email' />
            </Box>

            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password..."
                type="password"
                variant="outlined"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName="password" />
            </Box>
          </Box>

          {/* Nút Submit */}
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              className='interceptor-loading'
              sx={{ fontWeight: 600 }}
            >
              Login
            </Button>
          </CardActions>

          {/* Chuyển sang trang Đăng ký */}
          <Box sx={{ padding: '0 1em 1.2em 1em', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              New to Trello?
            </Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  mt: 0.3,
                  '&:hover': { color: '#ffbb39' }
                }}
              >
                Create account!
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm