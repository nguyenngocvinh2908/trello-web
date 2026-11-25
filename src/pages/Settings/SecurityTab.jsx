import React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import PasswordIcon from '@mui/icons-material/Password'
import LockResetIcon from '@mui/icons-material/LockReset'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { alpha } from '@mui/material/styles'

import { useForm } from 'react-hook-form'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateUserAPI, logoutUserAPI } from '~/redux/user/userSlice'
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE, PASSWORD_CONFIRMATION_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

function SecurityTab() {
  const dispatch = useDispatch()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  // Khởi tạo state quản lý trạng thái hiển thị mật khẩu của 3 trường input
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false })

  // Hàm sử lý bật tắt hiển thị mật khẩu theo từng trường
  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const confirmChangePassword = useConfirm()
  const submitChangePassword = async (data) => {
    const { confirmed } = await confirmChangePassword({
      title: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LogoutIcon sx={{ color: 'warning.main' }} /> Change Password
        </Box>
      ),
      description: 'You will be logged out after successfully changing your password. Do you want to continue?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    })

    if (confirmed) {
      const { current_password, new_password } = data

      // Sử dụng unwrap() để chuyển Promise do createAsyncThunk trả về thành Promise thông thường.
      // Khi fulfilled: trả về payload.
      // Khi rejected: throw lỗi (reject Promise), giúp toast.promise() nhận biết và hiển thị trạng thái tương ứng.
      toast.promise(
        dispatch(updateUserAPI({ current_password, new_password })).unwrap(),
        {
          pending: 'Updating password...',
          success: 'Successfully changed your password, please login again!'
        }
      ).then(() => dispatch(logoutUserAPI(false)))
    }
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': { borderRadius: 2.5 }
  }

  return (
    <Box>
      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Change Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update your password regularly to keep your account protected.
        </Typography>
      </Box>

      {/* Banner lưu ý */}
      <Box
        sx={{
          mt: 2.5,
          p: 2,
          borderRadius: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          border: '1px solid',
          borderColor: (theme) => alpha(theme.palette.info.main, 0.25)
        }}
      >
        <InfoOutlinedIcon color="info" fontSize="small" />
        <Typography variant="body2" color="text.secondary">
          For your security, you will need to sign in again after changing your password.
        </Typography>
      </Box>

      <Divider sx={{ my: 3.5 }} />

      <form onSubmit={handleSubmit(submitChangePassword)}>
        <Box sx={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Mật khẩu hiện tại */}
          <Box>
            <TextField
              fullWidth
              label="Current Password"
              type={showPassword.current ? 'text' : 'password'}
              variant="outlined"
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => toggleShowPassword('current')} edge="end" size="small">
                      {showPassword.current ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register('current_password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
              error={!!errors['current_password']}
            />
            <FieldErrorAlert errors={errors} fieldName={'current_password'}/>
          </Box>

          {/* Mật khẩu mới */}
          <Box>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword.new ? 'text' : 'password'}
              variant="outlined"
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => toggleShowPassword('new')} edge="end" size="small">
                      {showPassword.new ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register('new_password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
              error={!!errors['new_password']}
            />
            <FieldErrorAlert errors={errors} fieldName={'new_password'}/>
          </Box>

          {/* Nhập lại mật khẩu mới */}
          <Box>
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword.confirm ? 'text' : 'password'}
              variant="outlined"
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockResetIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => toggleShowPassword('confirm')} edge="end" size="small">
                      {showPassword.confirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register('new_password_confirmation', {
                validate: (value) => {
                  if (value === watch('new_password')) return true
                  return PASSWORD_CONFIRMATION_MESSAGE
                }
              })}
              error={!!errors['new_password_confirmation']}
            />
            <FieldErrorAlert errors={errors} fieldName={'new_password_confirmation'} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 600,
                px: 3.5,
                py: 1.1
              }}
            >
              Update Password
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default SecurityTab