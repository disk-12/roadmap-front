import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Tab, Tabs, TextField } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import { RoadmapCard } from 'components/RoadmapCard'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { ResponseData } from 'schemaHelper'

const SearchPage: NextPage = () => {
  const [tab, setTab] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState<ResponseData<'/home_timeline', 'get'>>([])

  const { mutate } = useMutation<unknown, unknown, string>(
    async (params) =>
      await axios
        .get<ResponseData<'/home_timeline', 'get'>>(`/search/roadmaps/${params}`)
        .then(({ data }) => setData(data))
  )

  return (
    <Box display='flex' flexDirection='column'>
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
        <Button onClick={() => mutate(searchText)} color='primary' variant='contained' disabled={tab === 1}>
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </Box>
      <Box flexGrow={1} display='flex' flexDirection='column'>
        {data.map((e) => (
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
      </Box>
    </Box>
  )
}

export default SearchPage
