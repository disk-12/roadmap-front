import { Box, Tab, Tabs } from '@mui/material'
import { Header } from 'components/Header'
import { RoadmapCard } from 'components/RoadmapCard'
import dayjs from 'dayjs'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'react-query'
<<<<<<< HEAD
import { request } from 'schemaHelper'
=======
import { ResponseData } from 'schemaHelper'
import { auth } from 'services/firebase'
>>>>>>> implement auth page

const MyPage: NextPage = () => {
  const [tab, setTab] = useState(0)
  const { data: favs } = useQuery('/favorites', () =>
    request({ url: '/favorites', method: 'get' }).then(({ data }) => data)
  )
<<<<<<< HEAD
  const { data: histories } = useQuery('/histories', () =>
    request({ url: '/histories', method: 'get' }).then(({ data }) => data)
  )

=======

  /* ログイン */
>>>>>>> implement auth page
  return (
    <Box>
      <Header title='マイページ' url='/my' />
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
          {favs?.map((e) => (
            <RoadmapCard
              key={e.id}
              imgUrl={''}
              id={e.id}
              title={e.title}
              favCount={e.favorite_count}
              createdAt={dayjs(e.created_at).format('YY-MM-DD')}
            />
          ))}
        </>
      ) : (
        <Box m={1} p={1} bgcolor='white'>
          {histories?.map((e) => (
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
      )}
    </Box>
  )
}

export default MyPage
const TabList = [{ title: '投稿リスト' }, { title: 'お気に入り' }, { title: '閲覧履歴' }] as const
