import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import NotFound from '~/pages/404/NotFound'
import Board from '~/pages/Boards/_id'
import Auth from '~/pages/Auth/auth'
import AccountVerification from '~/pages/Auth/AccountVerification'

// 1. Chặn người dùng CHƯA đăng nhập vào các trang cần bảo mật (Board, Settings...)
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}

// 2. Chặn người dùng ĐÃ đăng nhập quay ngược lại trang /login hoặc /register
const UnauthorizedRoute = ({ user }) => {
  if (user) return <Navigate to="/" replace={true} />
  return <Outlet />
}


function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      {/* Các route chỉ truy cập được KHI ĐÃ ĐĂNG NHẬP */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/" element={<Navigate to="/boards/6af1704dfa8ef4052eb39048" replace={true} />} />
        <Route path="/boards/:boardId" element={<Board />} />
      </Route>

      {/* Các route chỉ truy cập được KHI CHƯA ĐĂNG NHẬP */}
      <Route element={<UnauthorizedRoute user={currentUser} />}>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Route>

      {/* Route xác thực email (ai cũng vào được nếu có đủ query email & token) */}
      <Route path="/account/verification" element={<AccountVerification />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
