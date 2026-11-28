import { React, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import InputAdornment from '@mui/material/InputAdornment'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
// import { createNewBoardAPI } from '~/apis'

// Định nghĩa các loại quyền riêng tư của Board (khớp với validate ở Backend)
const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

/**
 * Component hiển thị nút "Create a new board" ở Sidebar kèm Modal tạo Board
 * @param {Function} afterCreateNewBoard - Callback gọi lại danh sách board ở trang cha sau khi tạo thành công
 */
function SidebarCreateBoardModal({ afterCreateNewBoard }) {
  // State quản lý trạng thái đóng/mở của hộp thoại tạo Board
  const [isOpen, setIsOpen] = useState(false)

  // Khởi tạo react-hook-form với giá trị mặc định
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      type: BOARD_TYPES.PUBLIC
    }
  })

  // Mở modal
  const handleOpenModal = () => setIsOpen(true)

  // Đóng modal và reset toàn bộ dữ liệu đã nhập trong form về mặc định
  const handleCloseModal = () => {
    setIsOpen(false)
    reset()
  }

  // Xử lý submit form tạo Board mới
  const submitCreateNewBoard = (data) => {
    // toast.promise(
    //   createNewBoardAPI(data),
    //   {
    //     pending: 'Creating new board...',
    //     success: 'Board created successfully!'
    //   }
    // )
    //   .then(() => {
    //     // 1. Đóng modal và xóa trắng form
    //     handleCloseModal()
    //     // 2. Báo cho component cha (Boards/index.jsx) gọi lại API lấy danh sách board mới nhất
    //     if (typeof afterCreateNewBoard === 'function') {
    //       afterCreateNewBoard()
    //     }
    //   })
    //   .catch(() => {
    //     // Đã có Axios Interceptor tự động hiển thị toast.error nên chỉ cần chặn lỗi đỏ ở Console
    //   })
  }

  return (
    <>
      {/* Nút bấm kích hoạt mở Modal nằm ở cuối Sidebar bên trái */}
      <Box
        onClick={handleOpenModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.25,
          borderRadius: 2.5,
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.9rem',
          color: 'text.secondary',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'action.hover',
            color: 'text.primary'
          }
        }}
      >
        <LibraryAddIcon fontSize="small" color="primary" />
        Create a new board
      </Box>

      {/* Hộp thoại (Dialog) nhập thông tin Board mới */}
      <Dialog
        open={isOpen}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3.5,
            p: 0.5,
            bgcolor: 'background.paper', // Tự động đồng bộ màu Light (#ffffff) và Dark (#34495e)
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <form onSubmit={handleSubmit(submitCreateNewBoard)}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
            <LibraryAddIcon color="primary" />
            Create a new board
          </DialogTitle>

          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '12px !important' }}>
            {/* Ô nhập tiêu đề Board */}
            <TextField
              fullWidth
              label="Board Title"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AbcIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              {...register('title', {
                required: 'Title is required.',
                minLength: { value: 3, message: 'Min length is 3 characters.' },
                maxLength: { value: 50, message: 'Max length is 50 characters.' }
              })}
              error={!!errors['title']}
              helperText={errors['title']?.message}
            />

            {/* Ô nhập mô tả Board */}
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Description"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionOutlinedIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              {...register('description', {
                required: 'Description is required.',
                minLength: { value: 3, message: 'Min length is 3 characters.' },
                maxLength: { value: 255, message: 'Max length is 255 characters.' }
              })}
              error={!!errors['description']}
              helperText={errors['description']?.message}
            />

            {/* Nhóm Radio chọn chế độ hiển thị Public / Private */}
            {/*
              * Lưu ý đối với RadioGroup của MUI thì ko thể dùng register tương tự TextField được
              * mà phải sử dụng <Controller></Controller> và props 'control' của react-hook-form như
              * cách làm dưới đây
             */}
            <Box>
              <FormLabel sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Visibility</FormLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value={BOARD_TYPES.PUBLIC}
                      control={<Radio size="small" />}
                      label="Public"
                    />
                    <FormControlLabel
                      value={BOARD_TYPES.PRIVATE}
                      control={<Radio size="small" />}
                      label="Private"
                    />
                  </RadioGroup>
                )}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseModal} color="inherit">
              Cancel
            </Button>
            {/* Class interceptor-loading giúp Axios tự động khóa nút khi đang gửi request */}
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              disableElevation
              sx={{ borderRadius: 2, px: 3 }}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default SidebarCreateBoardModal