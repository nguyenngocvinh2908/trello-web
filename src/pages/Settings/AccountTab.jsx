import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'

import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'

const LIMIT_COMMON_FILE_SIZE = 10485760 // 10MB
const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Maximum file size exceeded. (10MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only accept jpg, jpeg and png'
  }
  return null
}

function AccountTab() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  // Sử dụng defaultValues để set giá trị mặc định cho các field cần thiết
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      displayName: currentUser?.displayName
    }
  })

  const submitChangeGeneralInformation = (data) => {
    const { displayName } = data
    if (displayName === currentUser?.displayName) return

    // Gọi API UpdateUserAPI
    toast.promise(
      dispatch(updateUserAPI({ displayName })).unwrap(),
      {
        pending: 'Updating...',
        success: 'User updated successfully!'
      }
    )
  }

  const uploadAvatar = (e) => {
    const file = e.target?.files[0]
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }

    const reqData = new FormData()
    reqData.append('avatar', file)

    toast.promise(
      dispatch(updateUserAPI(reqData)),
      { pending: 'Uploading avatar...' }
    ).then((res) => {
      if (!res.error) {
        toast.success('Avatar updated successfully!')
      }
      e.target.value = ''
    })
  }

  return (
    <Box>
      {/* Khu vực Avatar & Thông tin tóm tắt */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Tooltip title="Change avatar">
              <IconButton
                component="label"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  border: '2px solid',
                  borderColor: 'background.paper',
                  boxShadow: 2,
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 16 }} />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={uploadAvatar}
                />
              </IconButton>
            </Tooltip>
          }
        >
          <Avatar
            sx={{
              width: 92,
              height: 92,
              border: '3px solid',
              borderColor: 'divider'
            }}
            alt={currentUser?.displayName}
            src={currentUser?.avatar}
          />
        </Badge>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            {currentUser?.displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            @{currentUser?.username}
          </Typography>
          <Typography variant="caption" color="text.disabled" display="block">
            Allowed formats: JPG, JPEG, PNG. Max size 10MB.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3.5 }} />

      {/* Form cập nhật thông tin cá nhân */}
      <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2.5 }}>
          Personal Information
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2.5
            }}
          >
            <TextField
              disabled
              defaultValue={currentUser?.email}
              fullWidth
              label="Email Address"
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'action.hover' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              disabled
              defaultValue={currentUser?.username}
              fullWidth
              label="Username"
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'action.hover' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Display Name"
              type="text"
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              {...register('displayName', {
                required: FIELD_REQUIRED_MESSAGE
              })}
              error={!!errors['displayName']}
            />
            <FieldErrorAlert errors={errors} fieldName={'displayName'}/>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
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
              Save Changes
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default AccountTab