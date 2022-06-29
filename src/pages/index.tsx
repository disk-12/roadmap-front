import { Box } from '@mui/system'
import { Tab, Tabs } from '@mui/material'
import type { NextPage } from 'next'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { RoadmapCard } from 'components/RoadmapCard'
import { request } from 'schemaHelper'
import dayjs from 'dayjs'
<<<<<<< HEAD
import { Header } from 'components/Header'

=======
import { auth } from 'services/firebase'
>>>>>>> implement auth page
const Home: NextPage = () => {
  const [tab, setTab] = useState(0)
  const { data } = useQuery('/home_timeline', () =>
    request({ url: '/home_timeline', method: 'get' }).then(({ data }) => data)
  )
<<<<<<< HEAD
  const { data: recommendData } = useQuery('/recommend/roadmaps', () =>
    request({ url: '/recommend/roadmaps', method: 'get' }).then(({ data }) => data)
  )

=======
>>>>>>> implement auth page
  return (
    <Box>
      <Header url='/' />
      <Box bgcolor='white'>
        <Tabs value={tab} variant='fullWidth'>
          {['新着', 'おすすめ'].map((e, idx) => (
            <Tab label={e} onClick={() => setTab(idx)} key={idx} />
          ))}
        </Tabs>
      </Box>
      {tab === 0
        ? data?.map((e) => (
            /* TODO: サムネどうする？ */
            <RoadmapCard
              key={e.id}
              imgUrl={''}
              id={e.id}
              title={e.title}
              favCount={e.favorite_count}
              createdAt={dayjs(e.created_at).format('YY-MM-DD')}
            />
          ))
        : recommendData?.map((e) => (
            /* TODO: サムネどうする？ */
            <RoadmapCard
              key={e.id}
              imgUrl={''}
              id={e.id}
              title={e.title}
              favCount={e.favorite_count}
              createdAt={dayjs(e.created_at).format('YY-MM-DD')}
            />
          ))}
    </Box>
  )
}

export default Home
