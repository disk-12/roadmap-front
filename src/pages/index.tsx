import axios from 'axios'
import { Box } from '@mui/system'
import { Tab, Tabs } from '@mui/material'
import type { NextPage } from 'next'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { RoadmapCard } from 'components/RoadmapCard'

const Home: NextPage = () => {
  const [tab, setTab] = useState(0)
  const { data } = useQuery('/api/get_newmap', () => axios.get<Data[]>('/api/get_newmap').then(({ data }) => data))
  return (
    <Box>
      <Box bgcolor='white'>
        <Tabs value={tab} variant='fullWidth'>
          {['新着', 'おすすめ'].map((e, idx) => (
            <Tab label={e} onClick={() => setTab(idx)} key={idx} />
          ))}
        </Tabs>
      </Box>
      {tab === 0 ? (
        data?.map((e) => (
          <RoadmapCard key={e.id} imgUrl={e.imgurl || ''} id={e.id} summary={e.summary} title={e.title} />
        ))
      ) : (
        <Box m={1} p={1} bgcolor='white'>
          後で作る
        </Box>
      )}
    </Box>
  )
}

export default Home

type Data = {
  id: number
  title: string
  summary: string
  imgurl?: string
}
