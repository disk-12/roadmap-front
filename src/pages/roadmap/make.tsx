import axios from 'axios'
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

const MakeRoadmap: NextPage = () => {
  const [mode, setMode] = useState<'addNode' | 'addMainLine' | 'addSubLine' | 'setNode' | 'info' | 'delete'>('addNode')
  const [arrowList, setArrowList] = useState<Arrow[]>([])
  const [nodeList, setNodeList] = useState<MapNode[]>([])
  const [nodeId, setNodeId] = useState(0)
  const [modalData, setModalData] = useState<MapNode | undefined>()
  const [addLineTemp, setAddLineTemp] = useState<number | undefined>()
  const [roadmapData, setRoadmapData] = useState<{ title: string; summary: string }>({ title: '', summary: '' })
  const [editingUrl, setEditingUrl] = useState('')
  const router = useRouter()

  const onSubmit = async () => {
    axios.post('/api/add_map', { ...roadmapData, nodeList, arrowList })
    router.push('/my')
  }

  const addNodeContents = (x: number, y: number) => {
    setNodeList((l) => [...l, { id: nodeId, x, y, title: '', summary: '', url: '' }])
    setNodeId((e) => e + 1)
  }

  const addLineContents = (nodeId: number) => {
    if (addLineTemp === undefined) {
      setAddLineTemp(nodeId)
      return
    }
    if (nodeId === addLineTemp) {
      setAddLineTemp(undefined)
      return
    }
    setArrowList((l) => [...l, { from: addLineTemp, to: nodeId, dashed: mode === 'addSubLine' }])
    setAddLineTemp(undefined)
  }

  const deleteNode = (id: number) => {
    setNodeList((l) => l.filter((e) => e.id !== id))
    setArrowList((l) => l.filter(({ from, to }) => id !== from && id !== to))
  }

  return (
    <Box
      position='relative'
      width='100%'
      height='100%'
      onClick={({ clientX, clientY }) => mode === 'addNode' && addNodeContents(clientX, clientY)}
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
      {nodeList.map((e) => (
        <NodeBox
          key={e.id}
          top={e.y}
          left={e.x}
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
            } else if (mode === 'delete') deleteNode(e.id)
          }}
        />
      ))}
      {arrowList.map((e, idx) => {
        const fromNode = nodeList.find(({ id }) => id === e.from)
        const toNode = nodeList.find(({ id }) => id === e.to)
        if (!fromNode || !toNode) return <></>
        return (
          <Arrow
            key={idx}
            from={{ ...fromNode }}
            to={{ ...toNode }}
            dashed={e.dashed}
            onClick={(ele) => {
              ele.stopPropagation()
              setArrowList((l) => l.filter(({ from, to }) => e.from !== from || e.to !== to))
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
                value={modalData.startSecond || ''}
                onChange={({ target }) =>
                  setModalData(() => ({
                    ...modalData,
                    startSecond: target.value === '' ? undefined : Number(target.value),
                  }))
                }
                placeholder='開始秒数'
                variant='outlined'
                size='small'
              />
              秒 ~
              <TextField
                value={modalData.endSecond || ''}
                onChange={({ target }) =>
                  setModalData(() => ({
                    ...modalData,
                    endSecond: target.value === '' ? undefined : Number(target.value),
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
                  setNodeList((l) => [...l.map((e) => (e.id === modalData.id ? { ...modalData } : { ...e }))])
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
            {nodeList.length === 0 && <Typography>* ノードを追加してください</Typography>}
            {nodeList.some((e) => e.title === '' || e.url === '') && (
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
              onClick={() => onSubmit()}
              fullWidth
              disabled={
                roadmapData.title === '' ||
                nodeList.length === 0 ||
                nodeList.some((e) => e.title === '' || e.url === '')
              }
            >
              投稿する
            </Button>
          </Box>
        </Box>
      </Dialog>
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

type MapNode = {
  id: number
  x: number
  y: number
  title: string
  summary: string
  url: string
  startSecond?: number
  endSecond?: number
}

type Arrow = {
  from: number
  to: number
  dashed: boolean
}
