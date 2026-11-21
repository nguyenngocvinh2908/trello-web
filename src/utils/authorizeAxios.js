import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo 1 đối tượng Axios (authorizeAxiosInstance) mục đích để custom và cấu hình chug cho dự án
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request: 10p
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: Sẽ cho phép Axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access)
// vào trong httpOnly Cookies của trình duyệt
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interepctors (Bộ đánh chặn vào giữa mọi request và response)
 */
// Interceptor Request: Can thiệp vào giữa các request gửi đi
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Có thể bật hiệu ứng loading toàn cục hoặc đính kèm header tùy chỉnh tại đây
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor Response: Can thiệp vào giữa các response nhận về từ BE
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false)
    // Mọi mã trạng thái HTTP nằm trong khoảng 200 - 299 sẽ đi vào đây
    return response
  },
  (error) => {
    interceptorLoadingElements(false)
    // Mọi mã trạng thái HTTP nằm ngoài khoảng 200 - 299 sẽ đi vào đây
    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code 1 lần: Clean Code)
    // hãy console.log(error) là sẽ thấy cấu trúc data dẫn tới message
    let errorMessage = error?.message
    if (error.response?.data?.message) errorMessage = error.response?.data?.message

    // Dùng toastify để hiển thị mọi mã lỗi lên màn hình — NGOẠI TRỪ mã 410 (đã tự động xử lý refresh token ngầm)
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance