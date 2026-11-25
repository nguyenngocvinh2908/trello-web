// theme.js
import { extendTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`

const theme = extendTheme({
  trelloCustom: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1976d2',
          dark: '#0764c0',
          light: '#63a4ff'
        },
        background: {
          default: '#f0f4f8',
          paper: '#ffffff'
        },
        divider: 'rgba(7, 100, 192, 0.12)',
        // Nhóm màu dùng riêng cho layout Trello
        trello: {
          appBarBg: '#0764c0',
          boardContentBg: '#1976d2'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#90caf9'
        },
        background: {
          default: '#22303e', // Đậm hơn AppBar (#2c3e50) một bậc để tạo chiều sâu
          paper: '#34495e' // Trùng tông với BoardContent (#34495e)
        },
        divider: 'rgba(255, 255, 255, 0.12)',
        // Nhóm màu dùng riêng cho layout Trello
        trello: {
          appBarBg: '#2c3e50',
          boardContentBg: '#34495e'
        }
      }
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: 'white'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // Tắt lớp phủ trắng mờ mặc định của MUI Dark Mode để giữ đúng màu #34495e
          backgroundImage: 'none'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '1px !important' },
          '&:hover fieldset': { borderWidth: '1px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1px !important' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          // color: theme.palette.primary.main
        })
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem'
          }
        }
      }
    }
  },
  // QUAN TRỌNG — để đổi theme bằng code
  colorSchemeSelector: 'class'
})

export default theme
