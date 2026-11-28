import { React, useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Grid from '@mui/material/Grid'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { alpha } from '@mui/material/styles'
import { Link, useLocation } from 'react-router-dom'
import randomColor from 'randomcolor'
import { fetchBoardsAPI } from '~/apis'
import SidebarCreateBoardModal from './create'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpiner'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'

function Boards() {
  // State lưu danh sách boards (null = đang tải lần đầu, [] = đã tải xong nhưng trống)
  const [boards, setBoards] = useState(null)

  // Tổng số lượng board trong DB để tính tổng số trang cho Pagination
  const [totalBoards, setTotalBoards] = useState(0)

  // Lấy query string trên URL (ví dụ: ?page=2) để gọi API phân trang tương ứng
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page') || DEFAULT_PAGE, 10)

  // Hàm cập nhật state từ dữ liệu API trả về
  const updateStateData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  // Gọi API lấy danh sách Board mỗi khi URL query (số trang) thay đổi
  useEffect(() => {
    fetchBoardsAPI(location.search).then(updateStateData)
  }, [location.search])

  // Callback truyền xuống SidebarCreateBoardModal để tải lại danh sách sau khi tạo Board mới
  const afterCreateNewBoard = () => {
    fetchBoardsAPI(location.search).then(updateStateData)
  }

  // Style dùng chung cho các mục điều hướng ở cột Sidebar bên trái
  const sidebarItemSx = (isActive = false) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    px: 2,
    py: 1.25,
    borderRadius: 2.5,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    color: isActive ? 'primary.main' : 'text.secondary',
    bgcolor: isActive ? (theme) => alpha(theme.palette.primary.main, 0.14) : 'transparent',
    '&:hover': {
      bgcolor: isActive ? (theme) => alpha(theme.palette.primary.main, 0.18) : 'action.hover',
      color: isActive ? 'primary.main' : 'text.primary'
    }
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Thanh Header chung toàn ứng dụng */}
      <AppBar />

      <Container maxWidth="xxl" sx={{ py: 4, flex: 1, display: 'flex', flexDirection: 'column' }} >
        {/* Khung chia bố cục chính bằng Grid v2: Sidebar 3 phần - Danh sách Board 9 phần */}
        <Grid container spacing={3} alignItems='stretch' sx={{ flex: 1 }} >
          {/* CỘT TRÁI: Thanh điều hướng Sidebar */}
          <Grid size={{ xs: 12, sm: 3, md: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Box component={Link} to="/boards" sx={sidebarItemSx(true)}>
                <SpaceDashboardIcon fontSize="small" />
                Boards
              </Box>
              <Box sx={sidebarItemSx(false)}>
                <ListAltIcon fontSize="small" />
                Templates
              </Box>
              <Box sx={sidebarItemSx(false)}>
                <HomeIcon fontSize="small" />
                Home
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Component tách riêng từ file create.jsx */}
              <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
            </Box>
          </Grid>

          {/* CỘT PHẢI: Khu vực hiển thị danh sách Board */}
          <Grid size={{ xs: 12, sm: 9, md: 10 }} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Tiêu đề & tổng số lượng Board */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3
              }}
            >
              <Typography variant="h5" fontWeight={700}>
                Your boards
              </Typography>
              {totalBoards > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Total: {totalBoards} {totalBoards === 1 ? 'board' : 'boards'}
                </Typography>
              )}
            </Box>

            {/* Trường hợp 1: Đang gọi API tải dữ liệu */}
            {!boards && <PageLoadingSpinner caption={'Loading Boards...'} variableWidth='initial' variableHeight='initial'/>}

            {/* Trường hợp 2: Đã tải xong nhưng user chưa có Board nào */}
            {boards?.length === 0 && (
              <Box
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 3.5,
                  border: '1px dashed',
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  No boards found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click &quot;Create a new board&quot; on the left menu to create your first workspace.
                </Typography>
              </Box>
            )}

            {/* Trường hợp 3: Lưới thẻ Board dùng Grid v2 (tự động xuống dòng khi có nhiều board) */}
            {boards?.length > 0 && (
              <Grid container spacing={2.5}>
                {boards.map((board) => (
                  <Grid key={board._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%', // Giữ các thẻ trên cùng 1 hàng luôn cao bằng nhau
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        overflow: 'hidden',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.14)'
                        }
                      }}
                    >
                      {/* Ảnh bìa màu ngẫu nhiên cố định theo board._id */}
                      <Box
                        sx={{
                          height: 84,
                          backgroundColor: randomColor({
                            seed: board._id,
                            luminosity: 'dark'
                          }),
                          position: 'relative',
                          p: 2,
                          display: 'flex',
                          alignItems: 'flex-end'
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background:
                              'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.32) 100%)'
                          }}
                        />
                      </Box>

                      {/* Nội dung tiêu đề, mô tả và nút điều hướng vào chi tiết Board */}
                      <CardContent
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          p: 2.25,
                          '&:last-child': { pb: 2.25 }
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          sx={{
                            mb: 0.75,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {board.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            minHeight: 40,
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {board.description || 'No description provided.'}
                        </Typography>

                        {/* Đẩy nút Go to board xuống sát đáy thẻ để thẳng hàng giữa các card */}
                        <Box
                          component={Link}
                          to={`/boards/${board._id}`}
                          sx={{
                            ml: 'auto',
                            mt: 'auto',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          Go to board
                          <ArrowRightIcon fontSize="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Thanh phân trang ở góc dưới bên phải */}
            {totalBoards > 0 && (
              <Box
                sx={{
                  mt: 'auto',
                  pt: 4,
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Pagination
                  size="large"
                  color="primary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                  page={page}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${item.page === 1 ? '' : `?page=${item.page}`}`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Boards