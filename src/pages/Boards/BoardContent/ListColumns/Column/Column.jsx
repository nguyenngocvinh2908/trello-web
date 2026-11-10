import React, { useState } from 'react'
import { useColorScheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Divider from '@mui/material/Divider'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Cloud from '@mui/icons-material/Cloud'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import ListCards from './ListCards/ListCards'
import CloseIcon from '@mui/icons-material/Close'
import * as sort from '~/utils/sort'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column }) {
  const { mode } = useColorScheme()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Map Sort List Card
  const orderedCards = sort.mapOrder(column?.cards, column?.cardOrderIds, '_id')

  // Dnd Trello
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id, // Kéo Thả Id Của Colum
    data: { ...column }
  })

  // Custom css cho phần tử kéo (drag)
  const dndKitColumnstyle = {
    // touchAction: 'none', // Dành cho trường hợp touch default
    // Nếu dùng CSS.Tranform theo dox thì lỗi strech drag -> Fix dùng Translate
    transform: CSS.Translate.toString(transform),
    transition,
    // Chiều cao của các column phải luôn bằng nhau để tránh pug kéo thả. Lưu ý phải kết hợp với [...listeners] ở box để kéo đúng chiều cao thật của nó
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  // Xử lý add new cart
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [addCardValue, setAddCardValue] = useState('')

  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const addNewCard = () => {
    if (!addCardValue) {
      return
    }
    // Gọi API Add New Card


    // Đóng trạng thái add Card $ clear inputAddNewCard
    toggleOpenNewCardForm()
    setAddCardValue('')
  }

  return (
    // Phải bọc div ở dây vì vấn đề chiều cao của column khi kéo thả sẽ bị bug
    <div ref={setNodeRef} style={dndKitColumnstyle} { ...attributes }>
      <Box
        { ...listeners }
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          maxHeight: (theme) => `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Column Header */}
        <Box
          sx={{
            height: (theme) => theme.trelloCustom.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{column?.title}</Typography>
          <Box>
            <Tooltip title="More Options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-button"
                aria-controls={open ? 'basic-column-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-column-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-column-button'
                }
              }}
            >
              <MenuItem>
                <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        {/* Column Content */}
        <ListCards cards={orderedCards} />
        {/* Column Footer */}
        <Box sx={{
          height: (theme) => theme.trelloCustom.columnFooterHeight,
          p: 2
        }}
        >
          {
            !openNewCardForm
              ?
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <Button size="small" startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>
                  Add new card
                </Button>
                <Tooltip title="Drag to move">
                  <DragHandleIcon sx={{ cursor: 'grab' }} />
                </Tooltip>
              </Box>
              :
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  label='Enter card title...'
                  type='text'
                  size='small'
                  variant='outlined'
                  autoFocus
                  value={addCardValue}
                  onChange={(e) => setAddCardValue(e.target.value)}
                  sx={{
                    '& label': { color: 'text.primary' },
                    '& input': {
                      color: mode === 'dark' ? 'white' : (theme => theme.palette.primary.main),
                      bgcolor: mode === 'dark' ? '#333643' : 'white'
                    },
                    '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                    },
                    '& .MuiOutlinedInput-input': {
                      borderRadius: 1
                    }
                  }}
                />
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
                    onClick={addNewCard}
                  >
                    Add
                  </Button>
                  <CloseIcon
                    fontSize='small'
                    sx={{
                      color: (theme) => theme.palette.warning.light,
                      cursor: 'pointer'
                    }}
                    onClick={toggleOpenNewCardForm} />
                </Box>
              </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column