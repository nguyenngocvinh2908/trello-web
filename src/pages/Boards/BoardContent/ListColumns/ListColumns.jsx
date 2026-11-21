import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TextField from '@mui/material/TextField'
import { cloneDeep } from 'lodash'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { generatePlaceholderCard } from '~/utils/formatters'
import { createNewColumnAPI } from '~/apis/index'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'

function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

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

    // Gọi API tạo mới column và làm lại dữ liệu state Board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Khi tạo column mới từ backend trả về thì nó chưa có card nào, cần xử lý vấn đề kéo thả vào 1 column rỗng
    const placeholderCard = generatePlaceholderCard(createdColumn)
    createdColumn.cards = [placeholderCard]
    createdColumn.cardOrderIds = [placeholderCard._id]

    // Cập nhật lại state Board (dùng cloneDeep để đảm bảo tính bất biến Immutability trong redux)
    // Nếu dùng const newBoard = { ...board } sẽ bị thông báo lỗi do spread operator là shallow coppy
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    /**
     * C2: Nếu ko dùng cloneDeep, ta có thể sử dụng array.concat thay cho push như docs của redux toolkit ở trên vì push sẽ thay đổi trực
     * tiếp trong mảng, còn concat thì nó sẽ merge - ghép mảng lại tạo ra 1 mảng mới riêng biệt
     * const newBoard = { ...board }
     * newBoard.columns.concat([createdColumn])
       newBoard.columnOrderIds.concat([createdColumn._id])
      */

    // Cập nhật lại board trong redux
    dispatch(updateCurrentActiveBoard(newBoard))

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
        {columns?.map(column => (<Column key={column._id} column={column} />)
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
                autoComplete='off'
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                sx={{
                  '& label': { color: 'white' },
                  '& input': {
                    color: 'white'
                  },
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
                  className='interceptor-loading'
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