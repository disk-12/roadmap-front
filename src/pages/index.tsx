import axios from 'axios'
import { Box } from '@mui/system'
import { Tab, Tabs } from '@mui/material'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { RoadmapCard } from 'components/RoadmapCard'
import { paths } from 'schema'
import { request } from 'schemaHelper'

const Home: NextPage = () => {
  const [tab, setTab] = useState(0)
  const { data, isLoading } = useQuery('/home_timeline', () =>
    request({ url: '/home_timeline', method: 'get' }).then(({ data }) => data)
  )

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
          /* TODO: サムネどうする？ */
          <RoadmapCard key={e.id} imgUrl={''} id={Number(e.id)} summary={'summary'} title={e.title} />
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
