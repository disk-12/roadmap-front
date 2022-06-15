import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Tab, Tabs, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import { RoadmapCard } from 'components/RoadmapCard'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { useMutation } from 'react-query'

const SearchPage: NextPage = () => {
  const [tab, setTab] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState<ListType[]>([])

  const { mutate } = useMutation<unknown, unknown, string>(
    async (params) => await axios.get<ListType[]>(`/api/get_search?keyword=${params}`).then(({ data }) => setData(data))
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
          <RoadmapCard key={e.id} title={e.title} id={e.id} imgUrl={e.imgurl} summary={e.summary} />
        ))}
      </Box>
    </Box>
  )
}

export default SearchPage

type ListType = {
  id: number
  summary: string
  title: string
  imgurl: string
}