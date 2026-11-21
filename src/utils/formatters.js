
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

/**
 * Kỹ thuật dùng css pointer-event để chặn user spam click tại bất kì chỗ nào có hành động click gọi api
 * Đây là kĩ thuật rất hay tận dụng Axios Interceptors và CSS Pointer-event để chỉ viết code 1 lần cho toàn bộ dự án
 * Cách sử dụng: Với tất cả các link hoặc button mà có hành động gọi api thêm class 'interceptor-loading' là ok
 */
export const interceptorLoadingElements = (calling) => {
  // Lấy toàn bộ phần tử trên trang hiện tại có class là 'interceptor-loading'
  const elements = document.querySelectorAll('.interceptor-loading')

  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Đang trong thời gian chờ gọi API -> làm mờ và chặn mọi sự kiện click
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      // API đã phản hồi xong (thành công hoặc lỗi) -> khôi phục trạng thái ban đầu
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}