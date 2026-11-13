// Board Detail Page
import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI } from '~/apis/index'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'


function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời mình fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao trực tiếp với trungquandev thì xử lý qua rect-router-dom
    const boardId = '6af1704dfa8ef4052eb39048'
    fetchBoardDetailsAPI(boardId).then((board) => {
      // Cần xử lý vấn đề kéo thả vào 1 column rỗng . Dùng cho f5 lại trang khi chạy lần đầu
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
      setBoard(board)
    })
  }, [])

  // Func này có nhiệm vụ gọi API tạo mới column và làm lại dữ liệu state Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Cập nhật lại state Board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    // Cần xử lý vấn đề kéo thả vào 1 column rỗng . Dùng cho column vừa tạo
    const placehoderCardToColumnEmty = newBoard.columns.find(column => column._id === createdColumn._id)
    placehoderCardToColumnEmty.cards = [generatePlaceholderCard(placehoderCardToColumnEmty)]
    placehoderCardToColumnEmty.cardOrderIds = [generatePlaceholderCard(placehoderCardToColumnEmty)._id]

    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API tạo mới card và làm lại dữ liệu state Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật lại state Board
    const newBoard = { ...board }
    newBoard.columns.map(( column) => {
      if (column._id === createdCard.columnId) {
        column.cards.push(createdCard)
        column.cardOrderIds.push(createdCard._id)
        return column
      }
      return column
    })
    setBoard(newBoard)
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} createNewColumn={createNewColumn} createNewCard={createNewCard}/>
    </Container>
  )
}

export default Board
