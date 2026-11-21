import React, { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpiner'
import { verifyUserAPI } from '~/apis/index'

function AccountVerification () {
  // Lấy giá trị email và token từ url
  const [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])

  // State kiểm soát trạng thái xác thực tài khoản
  const [verified, setVerified] = useState(false)

  // Gọi API xác thực ngay khi component mount và có đủ email, token
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {
        setVerified(true)
      })
    }
  }, [email, token])
  // Nếu URL thiếu một trong hai tham số email hoặc token -> đẩy sang trang 404
  if (!email || !token) {
    return <Navigate to="/404" />
  }

  // Trong thời gian chờ Backend xử lý -> hiển thị trạng thái Loading toàn màn hình
  if (!verified) {
    return (<PageLoadingSpinner caption="Verifying your account..." />)
  }

  // Xác thực thành công -> chuyển hướng về trang Login kèm query verifiedEmail
  return (<Navigate to={`/login?verifiedEmail=${email}`} />)
}

export default AccountVerification