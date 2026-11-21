// Board Detail Page
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis/index'
import { cloneDeep } from 'lodash'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpiner'

import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'

function Board() {
  const dispatch = useDispatch()
  // Không dùng state của componet mà dùng state của redux
  // const [board, setBoard] = useState(null)
  // Lấy dữ liệu board trực tiếp từ Redux Store
  const board = useSelector(selectCurrentActiveBoard)
  // useParams() trả về props
  const { boardId } = useParams()
  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // Func này có nhiệm vụ gọi api update lại dữ liệu kéo thả column xong xuôi
  const moveColumns = (dndOrderedColumns) => {
    // Update chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    /* Trường hợp này dùng Spread Operator này thì không sao vì chúng ta ko sử dụng push như trên làm thay đổi trực tiếp mảng kiểu
        rộng, mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mới. Tương tự như concat ở trường hợp trên
    */

    const newBoard = {
      ...board,
      columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnsIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API Update Dữ Liệu
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  /**
   * Khi di chuyển card trong cùng column
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của column chứ nó
   */
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // Update chuẩn dữ liệu state Board. Để Tránh Lỗi bất biến Immutability
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

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
    // Trường hợp này tương tự như moveColumns về tính bất biến Immutability
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    const newBoard = {
      ...board,
      columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnsIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // 2. Lấy mảng cardOrderIds mới của cột cũ và cột mới từ tham số thứ 4
    let prevCardOrderIds = dndOrderedColumns.find(column => column._id === prevColumnId)?.cardOrderIds
    // Xử lý kéo card cuối cùng của 1 column sang column khác thì phải gủi lên BE mảng [] tránh phái BE lỗi validate dữ liệu
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    const nextCardOrderIds = dndOrderedColumns.find(column => column._id === nextColumnId)?.cardOrderIds

    // Gọi API xử lý phía BE
    moveCardToDifferentColumnAPI({ currentCardId, prevColumnId, nextColumnId, prevCardOrderIds, nextCardOrderIds })
  }

  if (!board) {
    return (<PageLoadingSpinner caption={'Loading Board...'} />)
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}

        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
