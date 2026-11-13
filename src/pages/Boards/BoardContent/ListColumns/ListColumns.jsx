import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TextField from '@mui/material/TextField'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'


function ListColumns({ columns, createNewColumn, createNewCard }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title!')
      return
    }

    // Tạo dữ liệu new Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }

    /**
     * Gọi lên props function createNewColumn nằm ở compoment cha cao nhất (boards/_id.jsx)
     * Lưu ý: Về sau ở học phần nâng cao trực tiếp chúng ta sẽ đưa dữ liệu board ra ngoài Redux Global Store
     * Thì lúc này chúng ta sẽ gọi API ở đây là xong thay vì lần lượt gọi ngược lên những compoment cha phá trên khi nhận đc data newColumn
     * - Với việc sử dụng redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.
     */
    await createNewColumn(newColumnData)

    // Đóng trạng thái add column $ clear inputAddNewColumn
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  return (
    // Thằng SortableContext yêu cầu items là một mảng dạng [ 'id-01', 'id-02' ] chứ không phải [{ id: 'id-01' }]
    // Nó vẫn kéo thả được nhưng không có animation
    <SortableContext items={columns?.map(column => column._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgColor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m : 2 }
        }}
      >
        {columns?.map(column => (<Column key={column._id} column={column} createNewCard={createNewCard} />)
        )}

        {/* Box Add Column */}
        {
          !openNewColumnForm
            ?
            <Box
              onClick={toggleOpenNewColumnForm}
              sx={{
                minWidth: '250px',
                maxWidth: '250px',
                mx: 2,
                bgcolor: '#ffffff3d',
                height: 'fit-content',
                borderRadius: '6px'
              }}
            >
              <Button
                startIcon={<NoteAddIcon />}
                sx={{
                  color: 'white',
                  width: '100%',
                  justifyContent: 'flex-start',
                  pl: 2.5,
                  py: 1
                }}
              >
                Add new column
              </Button>
            </Box>
            :
            <Box
              sx={{
                minWidth: '250px',
                maxWidth: '250px',
                mx: 2,
                p: 1,
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: '#ffffff3d',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <TextField
                label='Enter column title...'
                type='text'
                size='small'
                variant='outlined'
                autoFocus
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                sx={{
                  '& label': { color: 'white' },
                  '& input': { color: 'white' },
                  '& label.Mui-focused': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  }
                }}/>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant='contained'
                  color='success'
                  size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.success.main
                    }

                  }}
                  onClick={addNewColumn}
                >
                  Add Column
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': {
                      color: (theme) => theme.palette.error.light
                    }
                  }}
                  onClick={toggleOpenNewColumnForm} />
              </Box>
            </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns