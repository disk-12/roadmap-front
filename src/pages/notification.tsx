import { Box, Tab, Tabs } from '@mui/material'
import { Header } from 'components/Header'
import { NextPage } from 'next'
import { useState } from 'react'

const NotificationPage: NextPage = () => {
  const [tab, setTab] = useState(0)
  return (
    <Box display='flex' flexDirection='column'>
      <Header title='通知' url='/notification' />
      <Box bgcolor='white'>
        <Tabs value={tab} variant='fullWidth'>
          {['称号', 'プルリク'].map((e, idx) => (
            <Tab label={e} onClick={() => setTab(idx)} key={idx} />
          ))}
        </Tabs>
      </Box>
      <Box m={1} p={1} bgcolor='white'>
        後で作る
      </Box>
    </Box>
  )
}

export default NotificationPage
