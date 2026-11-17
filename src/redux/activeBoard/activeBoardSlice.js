import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

// Khởi tạo giá trị State ban đầu của Slice
const initialState = {
  currentActiveBoard: null
}

// Hành động gọi API bất đồng bộ (Middleware) và cập nhật dữ liệu vào redux, dùng Middleware createAsyncThunk đi kèm vs extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

// Khởi tạo 1 cái slice trong kho lưu trữ - Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // reducers: Nơi xử lý dữ liệu đồng bộ (cập nhật state trực tiếp tại client)
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // Action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gắn 1 tên biến có ý nghĩa hơn
      const fullBoard = action.payload

      // Xử lý dữ liệu nếu cần thiết...
      // ...
      // Cập nhật lại dữ liệu vào Redux Store (Immer cho phép gán trực tiếp)
      state.currentActiveBoard = fullBoard
    }
  },
  // ExtraReducers: Hứng kết quả trả về từ các hàm createAsyncThunk (nơi xử lý dữ liệu bất đồng bộ)
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload chính là response.data trả về từ fetchBoardDetailsAPI
      let board = action.payload

      // Xử lý dữ liệu, nếu cần thiết

      // Sắp xếp thứ tự các column trước khi lưu vào Redux
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          const placeholderCard = generatePlaceholderCard(column)
          column.cards = [placeholderCard]
          column.cardOrderIds = [placeholderCard._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      state.currentActiveBoard = board
    })
  }
})

// Export Actions: Là nơi dành cho các component gọi thông qua dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer(chạy đồng bộ)
// Để ý ở trên thì activeBoardSlice ko có thuộc tính actions nào cả, bởi vì những cái action này đơn giản là được thằng redux đc tạo tự dộng theo tên của reducer.
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selectors: Là nơi dành cho các componets bên dưới gọi bằng hook useSelector() để lấy dữ liệu trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// Export Reducer để khai báo trong store.js
export const activeBoardReducer = activeBoardSlice.reducer