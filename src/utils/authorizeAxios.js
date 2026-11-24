import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { refreshTokenAPI } from '~/apis'

// Không thể import { store } trực tiếp theo cách thông thường trong file JS ngoài Component
// Giải pháp: Dùng kỹ thuật Inject Store (gọi hàm injectStore ở main.jsx)
// https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
let axiosReduxStore
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}

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

/**
 * Khởi tạo một cái Promise cho việc gọi API Refresh Token
 * Mục đích: Tạo Promise này để khi nào gọi API Refresh Token xong xuôi thì mới retry lại nhiều API bị lỗi trước đó
 * (nói thế này cho dễ hiểu) Nếu có nhiều API bị lỗi 410 cùng một lúc (ví dụ lúc mới F5 trang), chỉ gọi API refresh_token ĐÚNG 1 LẦN duy nhất thay vì gọi hàng loạt
 */
let refreshTokenPromise = null

// Interceptor Response: Can thiệp vào giữa các response nhận về từ BE
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false)
    // Mọi mã trạng thái HTTP nằm trong khoảng 200 - 299 sẽ đi vào đây
    return response
  },
  (error) => {
    interceptorLoadingElements(false)
    /** QUAN TRỌNG: Xử lý Refresh Token tự động */

    /**
     * TRƯỜNG HỢP 1: Nhận mã lỗi 401 (Unauthorized - không tìm thấy token hoặc token giả mạo)
     * -> Lập tức đăng xuất người dùng (truyền false để không hiện toast "Logged out successfully")
    */
    if (error.response?.status === 401) axiosReduxStore.dispatch(logoutUserAPI(false))

    /**
   * TRƯỜNG HỢP 2: Nhận mã lỗi 410 (GONE - accessToken hết hạn)
   * -> Âm thầm gọi API refresh_token để lấy accessToken mới, sau đó gọi lại các API bị lỗi
   */
    const originalRequests = error.config
    if (error.response?.status === 410 && !originalRequests._retry) {
      // Gán cờ _retry = true để tránh rơi vào vòng lặp vô tận nếu request gọi lại vẫn lỗi
      originalRequests._retry = true

      // Kiểm tra xem nếu chưa có tiến trình refreshToken nào đang chạy thì mới tạo mới
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // accessToken mới đã được Backend tự động ghi đè vào httpOnly Cookie
            return data?.accessToken
          })
          .catch((_error) => {
            // Nếu gọi refresh_token cũng thất bại (ví dụ refreshToken hết hạn sau 14 ngày)
            // -> Buộc đăng xuất người dùng
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(_error)
          })
          .finally(() => {
            // Dù thành công hay thất bại cũng reset lại biến về null cho những lần hết hạn sau
            refreshTokenPromise = null
          })
      }

      // Chờ refreshTokenPromise chạy xong rồi gọi lại chính request ban đầu bị lỗi 410
      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequests)
      })
    }

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