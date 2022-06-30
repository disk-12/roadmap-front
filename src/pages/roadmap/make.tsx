import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dialog, FormControlLabel, IconButton, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { request, RequestData } from 'schemaHelper'
import { useMutation } from 'react-query'
import { LottieModal } from 'components/LottieModal'
import { EditNodeModal } from 'components/NodeModal'
import { EditArea } from 'components/EditArea'
import { Header } from 'components/Header'

type Vertexes = RequestData<'/roadmaps', 'post'>['vertexes'][number]
type Edges = RequestData<'/roadmaps', 'post'>['edges']

const MakeRoadmap: NextPage = () => {
  const [vertexList, setVertexList] = useState<Vertexes[]>([])
  const [edgeList, setEdgeList] = useState<Edges>([])
  const [modalData, setModalData] = useState<Vertexes | undefined>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tagText, setTagText] = useState<string>('')
  const [roadmapData, setRoadmapData] = useState<{ title: string; tags: string[] }>({
    title: '',
    tags: [],
  })
  const router = useRouter()
  const [postedData, setPostedData] = useState<{ title: string }>()
  const [isLock, setIsLock] = useState(false)
  const [shareId, setShareId] = useState('')

  const $post = useMutation<unknown, unknown, RequestData<'/roadmaps', 'post'>>(
    async (params) => {
      request({
        url: '/roadmaps',
        method: 'post',
        data: params,
      }).then(({ data }) => setShareId(((data as any).id as string) || ''))
    },
    {
      onSuccess: () => {
        setPostedData({ title: '投稿完了！' })
      },
    }
  )

  return (
    <>
      <Header title='新規作成' url='/roadmap/make' />
      <EditArea
        vertexList={vertexList}
        setVertexList={setVertexList}
        edgeList={edgeList}
        setEdgeList={setEdgeList}
        setModalData={setModalData}
        setDialogOpen={setDialogOpen}
      />
      {modalData && <EditNodeModal setModalData={setModalData} setVertexList={setVertexList} modalData={modalData} />}
      <Dialog open={dialogOpen} maxWidth='sm' fullWidth>
        <Box bgcolor='#f5f5f5' p={2} display='flex' flexDirection='column' gap={2}>
          <Box color='red' fontSize='xx-small' display='flex' flexDirection='column' gap={0.25}>
            {roadmapData.title === '' && <Typography>* タイトルを入力してください</Typography>}
            {vertexList.length === 0 && <Typography>* ノードを追加してください</Typography>}
            {vertexList.some((e) => e.title === '') && <Typography>* 編集不足のノードがあります</Typography>}
          </Box>
          <TextField
            placeholder='ロードマップのタイトルを入力'
            fullWidth
            value={roadmapData.title}
            onChange={({ target }) => setRoadmapData(({ tags }) => ({ tags, title: target.value }))}
          />
          <Box display='flex' gap={1} alignItems='center'>
            <TextField
              placeholder='タグを追加'
              fullWidth
              value={tagText}
              onChange={({ target }) => setTagText(target.value)}
            />
            <IconButton
              disabled={tagText === ''}
              onClick={() => {
                setRoadmapData((e) => ({ ...e, tags: [...new Set([...e.tags, tagText])] }))
                setTagText('')
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </IconButton>
          </Box>
          <Box display='flex' gap={1}>
            {roadmapData.tags.map((tag) => (
              <Box key={tag} display='flex' border='1px solid gray' borderRadius='4px' color='gray' alignItems='center'>
                <Typography px={1}>{tag}</Typography>
                <IconButton onClick={() => setRoadmapData((e) => ({ ...e, tags: e.tags.filter((t) => t !== tag) }))}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </Box>
            ))}
          </Box>
          <RadioGroup value={String(isLock)} onChange={(e) => setIsLock(e.target.value === 'true')}>
            <Box display='flex' gap={1} alignItems='center'>
              <Typography>共同編集</Typography>
              <FormControlLabel value='false' control={<Radio />} label='許可' />
              <FormControlLabel value='true' control={<Radio />} label='禁止' />
            </Box>
          </RadioGroup>
          <Box display='flex' gap={2} width='100%' justifyContent='space-evenly'>
            <Button variant='contained' color='inherit' onClick={() => setDialogOpen(false)} fullWidth>
              閉じる
            </Button>
            <Button variant='contained' color='error' onClick={() => router.push('/my')} fullWidth>
              破棄して終了
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() =>
                $post.mutate({
                  title: roadmapData.title,
                  tags: roadmapData.tags,
                  edges: edgeList,
                  vertexes: vertexList,
                  locked: isLock,
                  thumbnail: (() => {
                    const v = vertexList.find(({ type }) => type === 'YOUTUBE')
                    return v?.type === 'YOUTUBE' ? v.youtube_id : undefined
                  })(),
                })
              }
              fullWidth
              disabled={
                roadmapData.title === '' || vertexList.length === 0 || vertexList.some(({ title }) => title === '')
              }
            >
              投稿する
            </Button>
          </Box>
        </Box>
      </Dialog>
      {postedData && (
        <LottieModal
          shareText={`ロードマップ ${roadmapData.title} を投稿しました! | RoMa`}
          shareUrl={typeof window !== 'undefined' ? `${location.origin}/roadmap/read?id=${shareId}` : ''}
          onClose={() => router.push('/my')}
          title={postedData.title}
        />
      )}
    </>
  )
}

export default MakeRoadmap
