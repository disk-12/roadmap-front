import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Tab, Tabs, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { Header } from 'components/Header'
import { RoadmapCard } from 'components/RoadmapCard'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { components } from 'schema'
import { request } from 'schemaHelper'

const SearchPage: NextPage = () => {
  const [tab, setTab] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState<components['schemas']['Roadmap'][]>([])

  const { mutate } = useMutation<unknown, unknown, string>(
    (params) =>
      request<'/search/roadmaps/{keyword}', 'get'>(
        { url: '/search/roadmaps/{keyword}', method: 'get' },
        { '{keyword}': params }
      ).then(({ data }) => data),
    { onSuccess: (d) => setData(d as components['schemas']['Roadmap'][]) }
  )

  return (
    <Box display='flex' flexDirection='column'>
      <Header title='検索' url='/search' />
      <Box bgcolor='white'>
        <Tabs value={tab} variant='fullWidth'>
          {['キーワード', 'タグ'].map((e, idx) => (
            <Tab label={e} onClick={() => setTab(idx)} key={idx} />
          ))}
        </Tabs>
      </Box>
      <Box bgcolor='white' width='95%' display='flex' mx='auto' my={1}>
        <TextField
          variant='outlined'
          size='small'
          value={searchText}
          placeholder={tab === 0 ? 'キーワードで検索' : 'タグで検索 (作ってない)'}
          fullWidth
          onChange={({ target }) => setSearchText(target.value)}
        />
        <Button
          onClick={() => mutate(searchText)}
          color='primary'
          variant='contained'
          disabled={tab === 1 || searchText === ''}
        >
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </Box>
      <Box flexGrow={1} display='flex' flexDirection='column'>
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
    </Box>
  )
}

export default SearchPage
