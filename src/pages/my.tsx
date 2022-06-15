import { Box, Tab, Tabs } from '@mui/material'
import axios from 'axios'
import { RoadmapCard } from 'components/RoadmapCard'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'react-query'

const MyPage: NextPage = () => {
  const [tab, setTab] = useState(0)
  const { data } = useQuery('/api/get_mymap', () => axios.get<Data[]>('/api/get_mymap').then(({ data }) => data))
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
            <RoadmapCard key={e.id} imgUrl={e.imgurl || ''} id={e.id} summary={e.summary} title={e.title} />
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

type Data = {
  id: number
  title: string
  summary: string
  imgurl?: string
}
