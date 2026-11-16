// Board Detail Page
import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI, deleteColumnDetailsAPI } from '~/apis/index'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty, cloneDeep } from 'lodash'
import * as sort from '~/utils/sort'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời mình fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao trực tiếp với trungquandev thì xử lý qua rect-router-dom
    const boardId = '6af1704dfa8ef4052eb39048'
    fetchBoardDetailsAPI(boardId).then((board) => {
      // 1. Sắp xếp thứ tự các column trước khi đưa dữ liệu xuống các component con
      board.columns = sort.mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        // Cần xử lý vấn đề kéo thả vào 1 column rỗng . Dùng cho f5 lại trang khi chạy lần đầu
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp sẵn column.cards theo đúng column.cardOrderIds ngay từ gốc
          column.cards = sort.mapOrder(column.cards, column.cardOrderIds, '_id')
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

    // Khi tạo column mới từ backend trả về thì nó chưa có card nào, cần xử lý vấn đề kéo thả vào 1 column rỗng
    const placeholderCard = generatePlaceholderCard(createdColumn)
    createdColumn.cards = [placeholderCard]
    createdColumn.cardOrderIds = [placeholderCard._id]

    // Cập nhật lại state Board (dùng cloneDeep để đảm bảo tính bất biến Immutability)
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API tạo mới card và làm lại dữ liệu state Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật lại state Board (dùng cloneDeep để đảm bảo tính bất biến Immutability)
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)

    if (columnToUpdate) {
      // Nếu column đang rỗng (chỉ chứa thẻ giữ chỗ FE_PlaceholderCard) thì thay thế hoàn toàn
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // Ngược lại nếu column đã có sẵn card thật thì push vào cuối mảng
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi api update lại dữ liệu kéo thả column xong xuôi
  const moveColumns = (dndOrderedColumns) => {
    // Update chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    const newBoard = {
      ...board,
      columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnsIds
    }
    setBoard(newBoard)

    // Gọi API Update Dữ Liệu
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  /**
   * Khi di chuyển card trong cùng column
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của column chứ nó
   */
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // Update chuẩn dữ liệu state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(newBoard)

    // Gọi API Update Dữ Liệu
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
  }

  /**
   * Khi di chuyển card sang column khác
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của columnActive and columnOver
   * Cập nhật columnId của card đó
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Update chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    const newBoard = {
      ...board,
      columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnsIds
    }
    setBoard(newBoard)

    // 2. Lấy mảng cardOrderIds mới của cột cũ và cột mới từ tham số thứ 4
    let prevCardOrderIds = dndOrderedColumns.find(column => column._id === prevColumnId)?.cardOrderIds
    // Xử lý kéo card cuối cùng của 1 column sang column khác thì phải gủi lên BE mảng [] tránh phái BE lỗi validate dữ liệu
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    const nextCardOrderIds = dndOrderedColumns.find(column => column._id === nextColumnId)?.cardOrderIds

    // Gọi API xử lý phía BE
    moveCardToDifferentColumnAPI({ currentCardId, prevColumnId, nextColumnId, prevCardOrderIds, nextCardOrderIds })
  }

  // Xử Lý Xóa 1 Column
  const deleteColumnDetails = (columnId) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    // Gọi API để xử lý phía BE
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult || 'Column deleted successfully!')
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
