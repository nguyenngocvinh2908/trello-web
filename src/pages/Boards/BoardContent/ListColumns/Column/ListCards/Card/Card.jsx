import React from 'react'
import { Card as MuiCard } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Card({ card }) {
  const isShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  // Dnd Card
  // Dnd Trello
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id, // Kéo Thả Id Của Colum
    data: { ...card }
  })

  // Custom css cho phần tử kéo (drag)
  const dndKitCardStyle = {
    // touchAction: 'none', // Dành cho trường hợp touch default
    // Nếu dùng CSS.Tranform theo dox thì lỗi strech drag -> Fix dùng Translate
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }
  return (
    <MuiCard
      ref={setNodeRef} style={dndKitCardStyle} { ...attributes } { ...listeners }
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset',
        height: card?.FE_PlaceholderCard ? '0px' : 'unset',
        border: card?.FE_PlaceholderCard ? 'none' : '1px solid transparent',
        '&:hover': {
          borderColor: (them) => them.palette.primary.main
        }
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card.cover} />
      }
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card.title}</Typography>
      </CardContent>
      {isShowCardActions() &&
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!card?.memberIds.length && <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds.length}</Button>}
          {!!card?.comments.length && <Button size="small" startIcon={<CommentIcon />}>{card?.comments.length}</Button>}
          {!!card?.attachments.length && <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments.length}</Button>}
        </CardActions>
      }
    </MuiCard>
  )
}

export default Card