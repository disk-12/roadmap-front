import { Box, Tab, Tabs } from '@mui/material'
import axios from 'axios'
import { RoadmapCard } from 'components/RoadmapCard'
import dayjs from 'dayjs'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { ResponseData } from 'schemaHelper'
import { auth } from 'services/firebase'

const MyPage: NextPage = () => {
  const [tab, setTab] = useState(0)
  const { data } = useQuery('/favorites', () =>
    axios.get<ResponseData<'/home_timeline', 'get'>>('/favorites').then(({ data }) => data)
  )

  /* ログイン */
  return (
    <Box>
      <Box bgcolor='white'>
        <Tabs value={tab} variant='fullWidth'>
          {TabList.map((e, idx) => (
            <Tab label={e.title} onClick={() => setTab(idx)} key={idx} />
          ))}
        </Tabs>
      </Box>
      {tab === 0 ? (
        <>
          <Box m={1} p={1} bgcolor='white'>
            <Link href='/roadmap/make'>
              <Box width='100%' height='100%'>
                新規作成
              </Box>
            </Link>
          </Box>
          {data?.map((e) => (
            <RoadmapCard
              key={e.id}
              imgUrl={''}
              id={e.id}
              summary={'summary'}
              title={e.title}
              favCount={e.favorite_count}
              createdAt={dayjs(e.created_at).format('YY-MM-DD')}
            />
          ))}
        </>
      ) : (
        <Box m={1} p={1} bgcolor='white'>
          後で作る
        </Box>
      )}
    </Box>
  )
}

export default MyPage
const TabList = [{ title: '投稿リスト' }, { title: 'お気に入り' }, { title: '閲覧履歴' }] as const
