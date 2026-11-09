import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useColorScheme } from '@mui/material/styles'
import * as formatters from '~/utils/formatters'

const MENU_STYLES = {
  color: 'white',
  paddingX: '5px',
  bgcolor: 'transparent',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  const { mode } = useColorScheme()

  return (
    <Box px={2} sx={
      {
        width: '100%',
        height: (theme) => theme.trelloCustom.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (mode === 'dark' ? '#34495e' : '#1976d2')
      }
    }>
      {/* Box Filter */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
            sx={MENU_STYLES}
          />
        </Tooltip>
        <Chip
          icon={<VpnLockIcon />}
          label={formatters.capitalizeFirstLetter(board?.type)}
          clickable
          sx={MENU_STYLES}
        />
        <Chip
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
          sx={MENU_STYLES}
        />
        <Chip
          icon={<BoltIcon />}
          label="Automation"
          clickable
          sx={MENU_STYLES}
        />
        <Chip
          icon={<FilterListIcon />}
          label="Filter"
          clickable
          sx={MENU_STYLES}
        />
      </Box>
      {/* Box User Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              '&:first-of-type': {
                bgcolor: '#a4b0be'
              }
            }
          }}
        >
          <Tooltip title="User 1">
            <Avatar
              alt="Remy Sharp"
              src="https://images.unsplash.com/photo-1759337283317-a452c486d79a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          </Tooltip>
          <Tooltip title="User 3">
            <Avatar
              alt="Remy Sharp"
              src="" />
          </Tooltip>
          <Tooltip title="User 4">
            <Avatar
              alt="Remy Sharp"
              src="" />
          </Tooltip>
          <Tooltip title="User 5">
            <Avatar
              alt="Remy Sharp"
              src="" />
          </Tooltip>
          <Tooltip title="User 6">
            <Avatar
              alt="Remy Sharp"
              src="" />
          </Tooltip>
          <Tooltip title="User 7">
            <Avatar
              alt="Remy Sharp"
              src="" />
          </Tooltip>
          <Tooltip title="User 8">
            <Avatar
              alt="Remy Sharp"
              src="" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar