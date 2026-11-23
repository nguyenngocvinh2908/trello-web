import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
// Cấu hình redux-persist
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Mặc định lưu vào localStorage

// Fix lỗi tương thích Vite: lấy .default nếu bị bọc thành module namespace
const persistStorage = storage.default || storage

// Cấu hình persist
const rootPersistConfig = {
  key: 'root', // Key của persist do chúng ta chỉ định. Mặc định cứ để là root
  storage: persistStorage, // Biến storage ở trên - lưu vào localStorage
  whitelist: ['user'] // Chỉ định duy nhất slice 'user' được phép lưu trữ khi F5
  // blacklist: ['activeBoard'] // Ngược lại với whitelist: định nghĩa các slice không muốn lưu
}

// Combine các reducers trong dự án
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

// Thực hiện persist Reducer
const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  // Fix lỗi cảnh báo không tương thích giữa redux-toolkit và redux-persist trong Console
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
