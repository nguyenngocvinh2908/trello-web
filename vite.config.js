import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      // svgrOptions: Là nơi truyền cấu hình trực tiếp xuống thư viện lõi @svgr/core — bộ máy chịu trách nhiệm đọc thẻ <svg>...</svg> và dịch thành component React.
      // Khi chuyển sang 'named', SVGR sẽ biên dịch file trello.svg thành một module có đồng thời cả hai kiểu export. export default và export module
      svgrOptions: {
        exportType: 'named'
      },
      // Ký tự ** đại diện cho các cấp thư mục con, còn *.svg đại diện cho file có đuôi svg trong toàn dự án
      include: '**/*.svg'
    })
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})

