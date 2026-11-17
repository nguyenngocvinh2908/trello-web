// Board Detail Page
import React, { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { createNewCardAPI, createNewColumnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI, deleteColumnDetailsAPI } from '~/apis/index'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty, cloneDeep } from 'lodash'
import * as sort from '~/utils/sorts'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
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

  useEffect(() => {
    const boardId = '6af1704dfa8ef4052eb39048'
    // Gọi API thông qua Redux Thunk
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch])

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

    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
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
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
  }

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

  // Xử Lý Xóa 1 Column
  const deleteColumnDetails = (columnId) => {
    // Update cho chuẩn dữ liệu state Board
    // Trường hợp này tương tự như moveColumns về tính bất biến Immutability
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

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
        deleteColumnDetails={deleteColumnDetails}
        moveColumns={moveColumns}

        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
