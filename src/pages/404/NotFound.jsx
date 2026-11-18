import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: '#1e272e',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
        overflow: 'hidden',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Minh họa SVG phi hành gia & thẻ Kanban */}
      <Box
        sx={{
          width: { xs: 260, sm: 340 },
          mb: 1,
          animation: 'float 4s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' }
          }
        }}
      >
        <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse
            cx="200"
            cy="135"
            rx="165"
            ry="52"
            transform="rotate(-12 200 135)"
            stroke="#64b5f6"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          <circle cx="68" cy="62" r="3" fill="#fdba26" />
          <circle cx="335" cy="54" r="4" fill="#64b5f6" />
          <circle cx="318" cy="202" r="3" fill="#fdba26" />
          <circle cx="85" cy="195" r="2.5" fill="#4fc3f7" />
          <path d="M115 35L117 41L123 43L117 45L115 51L113 45L107 43L113 41L115 35Z" fill="#fdba26" />
          <path d="M292 92L293.5 96.5L298 98L293.5 99.5L292 104L290.5 99.5L286 98L290.5 96.5L292 92Z" fill="#4fc3f7" />

          <circle cx="315" cy="70" r="18" fill="#1976d2" fillOpacity="0.9" />
          <ellipse
            cx="315"
            cy="70"
            rx="28"
            ry="7"
            transform="rotate(-20 315 70)"
            stroke="#90caf9"
            strokeWidth="2.5"
          />

          {/* Thẻ Kanban bay lơ lửng */}
          <g transform="rotate(-14 102 125)">
            <rect x="66" y="96" width="72" height="54" rx="8" fill="#64b5f6" fillOpacity="0.14" stroke="#64b5f6" strokeWidth="2" />
            <rect x="76" y="108" width="32" height="6" rx="3" fill="#fdba26" />
            <rect x="76" y="120" width="50" height="5" rx="2.5" fill="#90caf9" fillOpacity="0.75" />
            <rect x="76" y="130" width="38" height="5" rx="2.5" fill="#90caf9" fillOpacity="0.45" />
          </g>

          {/* Phi hành gia */}
          <g transform="translate(155, 58)">
            <rect x="18" y="54" width="54" height="58" rx="12" fill="#90a4ae" />
            <rect x="24" y="48" width="42" height="66" rx="18" fill="#eceff1" stroke="#b0bec5" strokeWidth="2" />
            <rect x="35" y="64" width="20" height="14" rx="3" fill="#1976d2" />
            <circle cx="40" cy="71" r="2" fill="#fdba26" />
            <circle cx="49" cy="71" r="2" fill="#69f0ae" />
            <path d="M24 62C10 66 6 78 12 86" stroke="#eceff1" strokeWidth="11" strokeLinecap="round" />
            <path d="M66 62C80 54 88 44 84 34" stroke="#eceff1" strokeWidth="11" strokeLinecap="round" />
            <path d="M36 112L30 138" stroke="#eceff1" strokeWidth="12" strokeLinecap="round" />
            <path d="M54 112L64 136" stroke="#eceff1" strokeWidth="12" strokeLinecap="round" />
            <circle cx="45" cy="30" r="26" fill="#ffffff" stroke="#b0bec5" strokeWidth="2.5" />
            <rect x="27" y="17" width="36" height="24" rx="12" fill="#172b4d" />
            <path d="M34 22C38 20 44 20 48 22" stroke="#4fc3f7" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      </Box>

      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '4.5rem', sm: '6.5rem' },
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-2px',
          background: 'linear-gradient(135deg, #64b5f6 0%, #fdba26 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1.5
        }}
      >
        404
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 1,
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}
      >
        Lost in Space!
      </Typography>

      <Typography
        variant="body1"
        sx={{
          maxWidth: 460,
          mb: 3.5,
          color: '#b0bec5',
          lineHeight: 1.6
        }}
      >
        Trang hoặc bảng làm việc bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đường dẫn không chính xác.
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        size="large"
        startIcon={<HomeIcon />}
        sx={{
          px: 3.5,
          py: 1.2,
          borderRadius: 2,
          fontWeight: 600,
          bgcolor: '#1976d2',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(25, 118, 210, 0.35)',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: '#1565c0',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.45)'
          }
        }}
      >
        Go Home
      </Button>
    </Box>
  )
}

export default NotFound