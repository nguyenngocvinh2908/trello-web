import React from 'react'
import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import SecurityIcon from '@mui/icons-material/Security'
import PersonIcon from '@mui/icons-material/Person'
import { alpha, useColorScheme } from '@mui/material/styles'
import { Link, Navigate, useParams } from 'react-router-dom'
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security'
}

function Settings() {
  const { tab } = useParams()
  const { mode } = useColorScheme()

  const isValidTab = Object.values(TABS).includes(tab)
  if (!isValidTab) {
    return <Navigate to="/404" replace={true} />
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <AppBar />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Tiêu đề trang */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Account Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your personal profile, avatar, and account security preferences.
          </Typography>
        </Box>

        <TabContext value={tab}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 4,
              alignItems: 'flex-start'
            }}
          >
            {/* Cột trái: Menu Tab dọc */}
            <Paper
              elevation={0}
              sx={{
                width: 250,
                flexShrink: 0,
                p: 1,
                borderRadius: 3.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <TabList
                orientation="vertical"
                TabIndicatorProps={{ sx: { display: 'none' } }}
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 46,
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.925rem',
                    justifyContent: 'flex-start',
                    px: 2,
                    mb: 0.5,
                    color: 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:last-of-type': { mb: 0 },
                    '&:hover': {
                      bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'action.hover',
                      color: 'text.primary'
                    },
                    '&.Mui-selected': {
                      color: 'primary.main',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12)
                    }
                  }
                }}
              >
                <Tab
                  label="General Profile"
                  value={TABS.ACCOUNT}
                  icon={<PersonIcon fontSize="small" />}
                  iconPosition="start"
                  component={Link}
                  to="/settings/account"
                />
                <Tab
                  label="Security & Password"
                  value={TABS.SECURITY}
                  icon={<SecurityIcon fontSize="small" />}
                  iconPosition="start"
                  component={Link}
                  to="/settings/security"
                />
              </TabList>
            </Paper>

            {/* Cột phải: Nội dung từng Tab */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 4,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <TabPanel value={TABS.ACCOUNT} sx={{ p: 0 }}>
                <AccountTab />
              </TabPanel>
              <TabPanel value={TABS.SECURITY} sx={{ p: 0 }}>
                <SecurityTab />
              </TabPanel>
            </Paper>
          </Box>
        </TabContext>
      </Container>
    </Box>
  )
}

export default Settings