// Board Detail Page
import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI } from '~/apis/index'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời mình fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao trực tiếp với trungquandev thì xử lý qua rect-router-dom
    const boardId = '6aeaf5d2e389de4052061c22'
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board)
    })
  }, [])
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board
