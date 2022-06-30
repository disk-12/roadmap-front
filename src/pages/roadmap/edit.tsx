import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dialog, IconButton, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import { EditArea } from 'components/EditArea'
import { Header } from 'components/Header'
import { LottieModal } from 'components/LottieModal'
import { EditNodeModal } from 'components/NodeModal'
import { CLIENT_DOMAIN } from 'env'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { request, RequestData, ResponseData } from 'schemaHelper'

type Vertexes = RequestData<'/roadmaps', 'post'>['vertexes'][number]
type Edges = RequestData<'/roadmaps', 'post'>['edges']

const EditRoadMap: NextPage<PageProps> = ({ data, id }) => {
  const [vertexList, setVertexList] = useState<Vertexes[]>(data.vertexes)
  const [edgeList, setEdgeList] = useState<Edges>(data.edges)
  const [modalData, setModalData] = useState<Vertexes | undefined>()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tagText, setTagText] = useState<string>('')
  const [roadmapData, setRoadmapData] = useState<{ title: string; tags: string[] }>({
    title: data.title,
    tags: data.tags,
  })
  const router = useRouter()
  const [postedData, setPostedData] = useState<{ title: string }>()

  const $patch = useMutation<unknown, unknown, RequestData<'/roadmaps/{roadmap_id}', 'patch'>>(
    async (params) => {
      request(
        {
          url: '/roadmaps/{roadmap_id}',
          method: 'patch',
          data: params,
        },
        { '{roadmap_id}': id }
      )
    },
    {
      onSuccess: () => {
        setPostedData({ title: '編集完了！' })
      },
    }
  )

  return (
    <>
      <Header title={`編集 - ${data.title}`} url={`/roadmap/edit?id=${id}`} />
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
            {vertexList.length === 0 && <Typography>* ノードを追加してください</Typography>}
            {vertexList.some((e) => e.title === '') && <Typography>* 編集不足のノードがあります</Typography>}
          </Box>
          <Typography>{roadmapData.title}</Typography>
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
                $patch.mutate({
                  title: roadmapData.title,
                  tags: roadmapData.tags,
                  edges: edgeList,
                  vertexes: vertexList,
                  locked: false,
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
              編集完了
            </Button>
          </Box>
        </Box>
      </Dialog>
      {postedData && (
        <LottieModal
          shareText={`ロードマップ ${roadmapData.title} を投稿しました! | RoMa`}
          shareUrl={typeof window !== 'undefined' ? `${location.origin}/roadmap/read?id=${id}` : ''}
          onClose={() => router.push('/my')}
          title={postedData.title}
        />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const id = context.query.id as string
  const data = await axios
    .get('/api/v1/map', {
      params: { id },
      baseURL: CLIENT_DOMAIN,
    })
    .then(({ data }) => data)
  return { props: { data, id } }
}

type PageProps = {
  data: ResponseData<'/roadmaps/{roadmap_id}', 'get'>
  id: string
}

export default EditRoadMap
