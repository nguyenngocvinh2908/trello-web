import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import NotFound from '~/pages/404/NotFound'
import Board from '~/pages/Boards/_id'
import Auth from '~/pages/Auth/auth'

function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route '/', có thể là hiểu route '/' sẽ ko còn nằm trong lịch sử của Browser
        <Navigate to="/boards/6af1704dfa8ef4052eb39048" replace={true} />
      } />

      {/* Board Details */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth/>} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
