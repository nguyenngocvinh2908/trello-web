import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import SvgIcon from '@mui/material/SvgIcon'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { registerUserAPI } from '~/apis/index'
import { toast } from 'react-toastify'

function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()

  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(
      registerUserAPI({ email, password }),
      { pending: 'Registration is progress...' }
    ).then(user => {
      navigate(`/login?registeredEmail=${user.email}`)
    })
  }

  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard
          sx={{
            minWidth: { xs: 340, sm: 380 },
            maxWidth: 380,
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
              Đăng ký tài khoản Trello mới
            </Typography>
          </Box>

          {/* Các trường nhập liệu Email, Password & Confirm Password */}
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
              <FieldErrorAlert errors={errors} fieldName="email" />
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

            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password Confirmation..."
                type="password"
                variant="outlined"
                error={!!errors['password_confirmation']}
                {...register('password_confirmation', {
                  required: FIELD_REQUIRED_MESSAGE,
                  validate: (value) => {
                    // eslint-disable-next-line react-hooks/incompatible-library
                    if (value === watch('password')) return true
                    return PASSWORD_CONFIRMATION_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName="password_confirmation" />
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
              Register
            </Button>
          </CardActions>

          {/* Chuyển sang trang Đăng nhập */}
          <Box sx={{ padding: '0 1em 1.2em 1em', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?
            </Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  mt: 0.3,
                  '&:hover': { color: '#ffbb39' }
                }}
              >
                Log in!
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default RegisterForm