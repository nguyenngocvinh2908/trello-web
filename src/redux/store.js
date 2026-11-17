import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'

export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer
    // Sau này có thể mở rộng thêm: user: userReducer, activeCard: activeCardReducer...
  }
})
