import {
  faArrowUp,
  faArrowUpRightDots,
  faCommentMedical,
  faInfoCircle,
  faPenToSquare,
  faSearch,
  faTrashCan,
  faUpDownLeftRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dialog, IconButton, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { NextPage } from 'next'
import { useState } from 'react'
import { Arrow } from 'components/Arrow'
import { NodeBox } from 'components/NodeBox'
import { VideoBox } from 'components/VideoBox'
import { useRouter } from 'next/router'
import { request, RequestData } from 'schemaHelper'
import { useMutation } from 'react-query'
import { LottieModal } from 'components/LottieModal'

type Vertexes = RequestData<'/roadmaps', 'post'>['vertexes']
type Edges = RequestData<'/roadmaps', 'post'>['edges']

const MakeRoadmap: NextPage = () => {
  const [mode, setMode] = useState<'addNode' | 'addMainLine' | 'addSubLine' | 'setNode' | 'info' | 'delete'>('addNode')

  const [vertexList, setVertexList] = useState<Vertexes>([])
  const [edgeList, setEdgeList] = useState<Edges>([])
  const [nodeId, setNodeId] = useState(0)
  const [modalData, setModalData] = useState<Vertexes[number] | undefined>()
  const [addLineTemp, setAddLineTemp] = useState<string | undefined>()
  const [roadmapData, setRoadmapData] = useState<{ title: string; summary: string }>({ title: '', summary: '' })
  const [editingUrl, setEditingUrl] = useState('')
  const router = useRouter()
  const [postedData, setPostedData] = useState<{ title: string }>()

  const $post = useMutation<unknown, unknown, RequestData<'/roadmaps', 'post'>>(
    async (params) => {
      request({
        url: '/roadmaps',
        method: 'post',
        data: params,
      })
    },
    {
      onSuccess: () => {
        setPostedData({ title: '投稿完了！' })
      },
    }
  )

  const addVertexListContents = (x: number, y: number) => {
    setVertexList((l) => [
      ...l,
      {
        id: String(nodeId),
        x_coordinate: x,
        y_coordinate: y,
        url: '',
        title: '',
        from_sec: 0,
        to_sec: 100,
        summary: '',
      },
    ])
    setNodeId((e) => e + 1)
  }

  const addLineContents = (vertexId: string) => {
    if (addLineTemp === undefined) {
      setAddLineTemp(vertexId)
      return
    }
    if (vertexId === addLineTemp) {
      setAddLineTemp(undefined)
      return
    }
    setEdgeList((l) => [
      ...l,
      {
        id: Math.random().toString(),
        source_id: addLineTemp,
        target_id: vertexId,
        is_solid_line: mode === 'addSubLine',
      },
    ])
    setAddLineTemp(undefined)
  }

  const deleteVertex = (id: string) => {
    setVertexList((l) => l.filter((e) => e.id !== id))
    setEdgeList((l) => l.filter(({ source_id, target_id }) => id !== source_id && id !== target_id))
  }

  return (
    <Box
      position='relative'
      width='100%'
      height='100%'
      onClick={({ clientX, clientY }) => mode === 'addNode' && addVertexListContents(clientX, clientY)}
      fontSize='small'
    >
      <Box position='absolute' right={0} bottom={0} p={2} display='grid' onClick={(e) => e.stopPropagation()} gap={1}>
        <Button color='inherit' variant='contained' disabled>
          <FontAwesomeIcon icon={faUpDownLeftRight} size='lg' />
        </Button>
        {optionList.map((e) => (
          <Button
            key={e.mode}
            color={mode === e.mode ? 'primary' : 'inherit'}
            variant='contained'
            onClick={() => setMode(e.mode)}
          >
            <FontAwesomeIcon icon={e.icon} size='lg' />
          </Button>
        ))}
      </Box>
      {vertexList.map((e) => (
        <NodeBox
          key={e.id}
          top={e.y_coordinate}
          left={e.x_coordinate}
          title={e.title === '' ? '新しいノード' : e.title}
          p={1}
          zIndex={1}
          isActive={mode === 'setNode' ? e.title !== '' && e.url !== '' : addLineTemp === e.id}
          onClick={(f) => {
            f.stopPropagation()
            if (mode === 'addMainLine' || mode === 'addSubLine') addLineContents(e.id)
            else if (mode === 'setNode') {
              setEditingUrl(e.url)
              setModalData(e)
            } else if (mode === 'delete') deleteVertex(e.id)
          }}
        />
      ))}
      {edgeList.map((e, idx) => {
        const fromNode = vertexList.find(({ id }) => id === e.source_id)
        const toNode = vertexList.find(({ id }) => id === e.target_id)
        if (!fromNode || !toNode) return <></>
        return (
          <Arrow
            key={idx}
            from={{ x: fromNode.x_coordinate, y: fromNode.y_coordinate }}
            to={{ x: toNode.x_coordinate, y: toNode.y_coordinate }}
            dashed={e.is_solid_line}
            onClick={(ele) => {
              ele.stopPropagation()
              setEdgeList((l) =>
                l.filter(({ source_id, target_id }) => e.source_id !== source_id || e.target_id !== target_id)
              )
            }}
          />
        )
      })}
      {modalData && (
        <Dialog open maxWidth='md' fullWidth>
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
                onChange={({ target }) => setModalData(() => ({ ...modalData, title: target.value }))}
                placeholder='タイトルを入力'
                variant='outlined'
                size='small'
                fullWidth
              />
            </Box>
            <Box p={1}>
              {modalData.url !== '' ? (
                <VideoBox {...modalData} url={modalData.url} onEnd={() => {}} />
              ) : (
                <Box bgcolor='gray' width='95%' mx='auto' height={'50vh'}></Box>
              )}
            </Box>
            <Box px={3} py={0.5} display='flex' gap={0.5}>
              <TextField
                value={editingUrl}
                onChange={({ target }) => setEditingUrl(target.value)}
                placeholder='動画IDを入力'
                variant='outlined'
                size='small'
                fullWidth
              />
              <IconButton onClick={() => setModalData({ ...modalData, url: editingUrl })}>
                <FontAwesomeIcon icon={faSearch} />
              </IconButton>
            </Box>
            <Box px={3} py={0.5} display='flex' gap={1}>
              <TextField
                value={modalData.from_sec}
                onChange={({ target }) =>
                  setModalData(() => ({
                    ...modalData,
                    from_sec: target.value === '' ? 0 : Number(target.value),
                  }))
                }
                placeholder='開始秒数'
                variant='outlined'
                size='small'
              />
              秒 ~
              <TextField
                value={modalData.to_sec}
                onChange={({ target }) =>
                  setModalData(() => ({
                    ...modalData,
                    to_sec: target.value === '' ? 0 : Number(target.value),
                  }))
                }
                placeholder='終了秒数'
                variant='outlined'
                size='small'
              />
              秒
            </Box>
            <Box px={3} py={0.5}>
              <TextField
                value={modalData.summary}
                onChange={({ target }) => setModalData(() => ({ ...modalData, summary: target.value }))}
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
      )}
      <Dialog open={mode === 'info'} maxWidth='sm' fullWidth>
        <Box bgcolor='#f5f5f5' p={2} display='flex' flexDirection='column' gap={2}>
          <Box color='red' fontSize='xx-small' display='flex' flexDirection='column' gap={0.25}>
            {roadmapData.title === '' && <Typography>* タイトルを入力してください</Typography>}
            {vertexList.length === 0 && <Typography>* ノードを追加してください</Typography>}
            {vertexList.some(() => false /* ここに各種制限（タイトル未記入など） */) && (
              <Typography>* 編集不足のノードがあります</Typography>
            )}
          </Box>
          <TextField
            placeholder='ロードマップのタイトルを入力'
            fullWidth
            value={roadmapData.title}
            onChange={({ target }) => setRoadmapData(({ summary }) => ({ summary, title: target.value }))}
          />
          <TextField
            placeholder='ロードマップの説明を入力'
            fullWidth
            minRows={3}
            multiline
            value={roadmapData.summary}
            onChange={({ target }) => setRoadmapData(({ title }) => ({ title, summary: target.value }))}
          />
          <Box display='flex' gap={2} width='100%' justifyContent='space-evenly'>
            <Button variant='contained' color='inherit' onClick={() => setMode('setNode')} fullWidth>
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
                  tags: [],
                  edges: edgeList,
                  vertexes: vertexList,
                })
              }
              fullWidth
              disabled={
                roadmapData.title === '' ||
                vertexList.length === 0 ||
                vertexList.some(() => false /* ここに各種制限（タイトル未記入など） */)
              }
            >
              投稿する
            </Button>
          </Box>
        </Box>
      </Dialog>
      {postedData && <LottieModal onClose={() => router.push('/my')} title={postedData.title} />}
    </Box>
  )
}

export default MakeRoadmap

const optionList = [
  { icon: faCommentMedical, mode: 'addNode' },
  { icon: faArrowUp, mode: 'addMainLine' },
  { icon: faArrowUpRightDots, mode: 'addSubLine' },
  { icon: faPenToSquare, mode: 'setNode' },
  { icon: faTrashCan, mode: 'delete' },
  { icon: faInfoCircle, mode: 'info' },
] as const
