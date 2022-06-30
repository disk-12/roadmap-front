import { Box, Button, Dialog, DialogTitle, Divider, Tab, Tabs, Typography } from '@mui/material'
import { Header } from 'components/Header'
import { RoadmapCard } from 'components/RoadmapCard'
import { UserContext } from 'context'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import Link from 'next/link'
import { FC, useContext, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { request } from 'schemaHelper'

const MyPage: NextPage = () => {
  const [tab, setTab] = useState(0)
  const user = useContext(UserContext)

  return (
    <Box>
      <Header title='マイページ' url='/my' />
      <Box bgcolor='white'>
        <Typography p={2} component='h2' fontWeight='bold'>
          {user?.name || '匿名'}さんのマイページ
        </Typography>
        <Tabs value={tab} variant='fullWidth'>
          {TabList.map((e, idx) => (
            <Tab label={e.title} onClick={() => setTab(idx)} key={idx} />
          ))}
        </Tabs>
      </Box>
      {tab === 0 && <MyList userId={user?.id} />}
      {tab === 1 && <FavList />}
      {tab === 2 && <HistoryList />}
    </Box>
  )
}

const MyList: FC<{ userId?: string }> = ({ userId }) => {
  const { data = [], isLoading } = useQuery('/users/{author_id}/roadmaps', () =>
    typeof userId === 'string'
      ? request({ url: '/users/{author_id}/roadmaps', method: 'get' }, { '{author_id}': userId }).then(
          ({ data }) => data
        )
      : undefined
  )
  if (isLoading) return <></>
  return (
    <Box display='flex' flexDirection='column'>
      <Box m={1} p={1} bgcolor='white'>
        <Link href='/roadmap/make'>
          <Box width='100%' height='100%'>
            新規作成
          </Box>
        </Link>
      </Box>
      <Box display='flex' flexDirection='column' gap={1}>
        {data?.map((e) => (
          <RoadmapCard
            key={e.id}
            imgUrl={e.thumbnail}
            id={e.id}
            title={e.title}
            favCount={e.favorite_count}
            createdAt={dayjs(e.created_at).format('YY-MM-DD')}
          />
        ))}
      </Box>
    </Box>
  )
}

const FavList: FC = () => {
  const { data = [], isLoading } = useQuery('/favorites', () =>
    request({ url: '/favorites', method: 'get' }).then(({ data }) => data)
  )
  if (isLoading) return <></>
  return data.length === 0 ? (
    <Typography m={1} p={1} bgcolor='white'>
      お気に入りのロードマップがありません
    </Typography>
  ) : (
    <Box display='flex' flexDirection='column' gap={1} my={1}>
      {data.map((e) => (
        <RoadmapCard
          key={e.id}
          imgUrl={e.thumbnail}
          id={e.id}
          title={e.title}
          favCount={e.favorite_count}
          createdAt={dayjs(e.created_at).format('YY-MM-DD')}
        />
      ))}
    </Box>
  )
}

const HistoryList: FC = () => {
  const { data = [], isLoading } = useQuery('/histories', () =>
    request({ url: '/histories', method: 'get' }).then(({ data }) => data)
  )
  // const [modalId, setModalId] = useState<string>()
  // const $delete = useMutation<unknown,unknown,string>(()=>request({url:"/roadmaps/{roadmap_id}",method:"delete"}))

  if (isLoading) return <></>
  return data.length === 0 ? (
    <Typography m={1} p={1} bgcolor='white'>
      閲覧履歴がありません
    </Typography>
  ) : (
    <>
      <Box display='flex' flexDirection='column' gap={1} my={1}>
        {data?.map((e) => (
          <RoadmapCard
            key={e.id}
            imgUrl={e.thumbnail}
            id={e.id}
            title={e.title}
            favCount={e.favorite_count}
            createdAt={dayjs(e.created_at).format('YY-MM-DD')}
          />
        ))}
      </Box>
      {/*
      {modalId && (
        <Dialog open maxWidth='md' fullWidth>
          <DialogTitle>
            <Typography>{data.find(({ id }) => id === modalId)?.title}を削除します</Typography>
          </DialogTitle>
          <Divider />
          <Box display='flex' gap={1} width='90%' m='auto'>
            <Button variant='contained' fullWidth onClick={() => setModalId(undefined)}>
              やめる
            </Button>
            <Box width='50%'>
              <Button onClick={()} variant='contained' fullWidth color='warning'>
                削除する
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}
      */}
    </>
  )
}

export default MyPage
const TabList = [{ title: '投稿リスト' }, { title: 'お気に入り' }, { title: '閲覧履歴' }] as const
