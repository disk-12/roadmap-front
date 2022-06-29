import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dialog, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useQuery } from 'react-query'
import { RequestData, ResponseData } from 'schemaHelper'
import { OgpCard } from './OgpCard'
import { VideoBox } from './VideoBox'

export const ReadNodeModal: FC<{
  modalData: ResponseData<'/roadmaps/{roadmap_id}', 'get'>['vertexes'][number]
  setModalData: (d: ResponseData<'/roadmaps/{roadmap_id}', 'get'>['vertexes'][number] | undefined) => void
  postEndRequest: () => void
}> = ({ modalData, setModalData, postEndRequest }) => {
  return (
    <Dialog open maxWidth='md' fullWidth>
      <Box>
        <Box mr={'auto'} p={2} display='flex' alignItems='center' justifyContent='space-between'>
          <Typography fontWeight='bold' component='h2' fontSize='large'>
            {modalData.title}
          </Typography>
          <Button color='error' variant='outlined' onClick={() => setModalData(undefined)}>
            x
          </Button>
        </Box>
        <Box p={1}>
          {modalData.type === 'YOUTUBE' ? (
            <VideoBox
              startSecond={modalData.youtube_start}
              endSecond={modalData.youtube_end}
              url={modalData.youtube_id}
              onEnd={() => postEndRequest()}
            />
          ) : (
            modalData.type === 'LINK' && <Box>{modalData.link}</Box>
          )}
        </Box>
        <Box px={3} py={1}>
          <Typography py={1} fontSize='smaller'>
            {modalData.content}
          </Typography>
        </Box>
        <Box justifyContent='flex-end' display='flex' p={1}>
          <Button onClick={() => postEndRequest()} variant='contained'>
            学習完了
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}

export const EditNodeModal: FC<{
  modalData: RequestData<'/roadmaps', 'post'>['vertexes'][number]
  setModalData: Dispatch<SetStateAction<RequestData<'/roadmaps', 'post'>['vertexes'][number] | undefined>>
  setVertexList: Dispatch<SetStateAction<RequestData<'/roadmaps', 'post'>['vertexes']>>
}> = ({ modalData, setModalData, setVertexList }) => {
  const [editingUrl, setEditingUrl] = useState(
    modalData.type === 'YOUTUBE' ? modalData.youtube_id ?? '' : modalData.type === 'LINK' ? modalData.link ?? '' : ''
  )

  const {
    data: ogp,
    refetch,
  } = useQuery(
    ['/api/v1/ogp', editingUrl],
    async () =>
      await axios
        .get<{ title: string; image: string; siteName: string }>('/api/v1/ogp', {
          params: { url: encodeURI(editingUrl) },
          baseURL: '',
        })
        .then(({ data }) => data),
    { enabled: false }
  )

  return (
    <Dialog open maxWidth='sm' fullWidth>
      <Box bgcolor='#f5f5f5'>
        <Box
          mx={'auto'}
          px={1}
          pt={1}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          fontWeight='bold'
        >
          <TextField
            value={modalData.title}
            onChange={({ target }) => setModalData({ ...modalData, title: target.value })}
            placeholder='タイトルを入力'
            variant='outlined'
            size='small'
            fullWidth
            error={modalData.title === ''}
          />
        </Box>
        <Box p={1}>
          <Select
            value={modalData.type}
            fullWidth
            size='small'
            // @ts-ignore
            onChange={(e) => setModalData({ ...modalData, type: e.target.value })}
          >
            <MenuItem value={'DEFAULT'}>DEFAULT</MenuItem>
            <MenuItem value={'YOUTUBE'}>YOUTUBE</MenuItem>
            <MenuItem value={'LINK'}>LINK</MenuItem>
          </Select>
        </Box>
        {modalData.type === 'YOUTUBE' && (
          <>
            <Box p={1}>
              {modalData.youtube_id !== '' ? (
                <VideoBox
                  url={modalData.youtube_id}
                  startSecond={modalData.youtube_start}
                  endSecond={modalData.youtube_end}
                  onEnd={() => {}}
                />
              ) : (
                <Box bgcolor='gray' width='95%' mx='auto' height={'50vh'}></Box>
              )}
            </Box>
            <Box px={1} py={0.5} display='flex' gap={0.5}>
              <TextField
                value={editingUrl}
                onChange={({ target }) => setEditingUrl(target.value)}
                placeholder='動画IDを入力'
                variant='outlined'
                size='small'
                fullWidth
              />
              <IconButton onClick={() => setModalData({ ...modalData, youtube_id: editingUrl })}>
                <FontAwesomeIcon icon={faSearch} />
              </IconButton>
            </Box>
            <Box px={1} py={0.5} display='flex' gap={1} alignItems='center'>
              <TextField
                value={modalData.youtube_start}
                onChange={({ target }) =>
                  setModalData(() => ({
                    ...modalData,
                    from_sec: target.value === '' ? 0 : Number(target.value),
                  }))
                }
                fullWidth
                placeholder='開始秒数'
                variant='outlined'
                size='small'
              />
              <Typography p={0.5}>秒~</Typography>
              <TextField
                value={modalData.youtube_end}
                onChange={({ target }) =>
                  setModalData(() => ({
                    ...modalData,
                    to_sec: target.value === '' ? 0 : Number(target.value),
                  }))
                }
                fullWidth
                placeholder='終了秒数'
                variant='outlined'
                size='small'
              />
              <Typography>秒</Typography>
            </Box>
          </>
        )}
        {modalData.type === 'LINK' && (
          <>
            {ogp && <OgpCard {...ogp} url={modalData.link} />}
            <Box display='flex' gap={1} alignItems='center' p={1}>
              <TextField
                value={editingUrl}
                onChange={({ target }) => setEditingUrl(target.value)}
                placeholder='リンクを入力'
                variant='outlined'
                size='small'
                fullWidth
              />
              <IconButton onClick={() => refetch().then(() => setModalData({ ...modalData, link: editingUrl }))}>
                <FontAwesomeIcon icon={faSearch} />
              </IconButton>
            </Box>
          </>
        )}
        <Box px={1} py={0.5}>
          <TextField
            value={modalData.content}
            onChange={({ target }) => setModalData(() => ({ ...modalData, content: target.value }))}
            placeholder='ノードの説明'
            variant='outlined'
            size='small'
            multiline
            minRows={2}
            fullWidth
          />
        </Box>
        <Box p={1} mr={1} display='grid' gridTemplateColumns={'1fr 1fr'}>
          <Button color='inherit' variant='contained' onClick={() => setModalData(undefined)} sx={{ mx: 1 }}>
            キャンセル
          </Button>
          <Button
            color='primary'
            variant='contained'
            onClick={() => {
              setVertexList((l) => [...l.map((e) => (e.id === modalData.id ? { ...modalData } : { ...e }))])
              setModalData(undefined)
            }}
            sx={{ mx: 1 }}
          >
            保存
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
