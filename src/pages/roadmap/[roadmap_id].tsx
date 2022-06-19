import { Box } from '@mui/system'
import { Button, Dialog, IconButton, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Arrow } from 'components/Arrow'
import { NodeBox } from 'components/NodeBox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCircleExclamation, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useQuery } from 'react-query'
import { request, ResponseData } from 'schemaHelper'

const RoadmapPage: NextPage = () => {
  const router = useRouter()
  const [modalData, setModalData] = useState<
    ResponseData<'/roadmaps/{roadmap_id}', 'get'>['vertexes'][number] | undefined
  >()
  const [endList, setEndList] = useState<string[]>([])
  const [infoOpen, setInfoOpen] = useState(false)
  const id = router.query['roadmap_id']

  const { data } = useQuery(['/api/get_single_roadmap', { id }], async () =>
    id !== undefined
      ? request({ url: '/roadmaps/{roadmap_id}', method: 'get' }, Number(id)).then(({ data }) => data)
      : undefined
  )
  const nodeList = data?.vertexes || []
  const arrowList = data?.edges || []
  const achievementPer = nodeList.length ? Math.round((endList.length / nodeList.length) * 100) : 0

  return (
    <Box textAlign='left' width='100%' height='100%'>
      <Box p={2} position='fixed' top={1} width='90%' display='flex' justifyContent='space-between' zIndex={1}>
        <Box width='100%' bgcolor='gray' height={32} borderRadius='0 2rem 2rem 0' position='relative'>
          <Box
            width={`${achievementPer}%`}
            bgcolor='#9c9'
            color='white'
            height='100%'
            borderRadius='0 2rem 2rem 0'
            sx={{ transition: '1s' }}
          />
          <Typography
            fontSize='xx-small'
            my='auto'
            position='absolute'
            top='50%'
            color='white'
            px={2}
            sx={{ transform: 'translate(0, -50%)' }}
          >
            達成率 {achievementPer}%
          </Typography>
        </Box>
      </Box>
      <Box
        position='absolute'
        right={0}
        bottom={0}
        p={2}
        display='grid'
        onClick={(e) => e.stopPropagation()}
        zIndex={1}
      >
        <IconButton color='primary' onClick={() => setInfoOpen(true)}>
          <FontAwesomeIcon icon={faFileCircleExclamation} size='1x' />
        </IconButton>
      </Box>
      <Box position='relative' width='100%' height='100%'>
        {nodeList.map((e) => (
          <NodeBox
            key={e.id}
            top={e.y_coordinate}
            left={e.x_coordinate}
            title={'ノードのタイトル'}
            p={1}
            zIndex={1}
            onClick={() => setModalData(e)}
            isActive={endList.includes(e.id)}
          />
        ))}
        {arrowList.map((e) => {
          const fromNode = nodeList.find(({ id }) => id === e.source_id)
          const toNode = nodeList.find(({ id }) => id === e.target_id)
          console.log(fromNode, toNode)
          if (!fromNode || !toNode) return <span key={e.id} />
          return (
            <Arrow
              key={e.id}
              from={{ x: fromNode.x_coordinate, y: fromNode.y_coordinate }}
              to={{ x: toNode.x_coordinate, y: toNode.y_coordinate }}
              dashed={e.is_solid_line}
            />
          )
        })}
      </Box>
      {modalData && (
        <Dialog open maxWidth='md' fullWidth>
          <Box>
            <Box mr={'auto'} p={2} display='flex' alignItems='center' justifyContent='space-between'>
              <Typography fontWeight='bold' component='h2' fontSize='large'>
                {'v title'}
              </Typography>
              <Button color='error' variant='outlined' onClick={() => setModalData(undefined)}>
                x
              </Button>
            </Box>
            <Box p={1}>
              {/*
              <VideoBox
                {...modalData}
                startSecond={modalData.video_from_sec}
                endSecond={modalData.video_to_sec}
                onEnd={() => setEndList((l) => [...new Set([...l, modalData.id])])}
              />
              */}
            </Box>
            <Box px={3} py={1}>
              <Typography>{'(url)'}</Typography>
              <Typography py={1} fontSize='smaller'>
                {'(summary)'}
              </Typography>
            </Box>
          </Box>
        </Dialog>
      )}
      <Dialog open={infoOpen} maxWidth='md' fullWidth>
        <Box p={2} display='flex' flexDirection='column'>
          <Box mr={'auto'} py={1} display='flex' alignItems='center' justifyContent='space-between' width='100%'>
            <Typography fontWeight='bold' component='h2' fontSize='large'>
              {data?.title}
            </Typography>
            <IconButton color='error' onClick={() => setInfoOpen(false)} disabled>
              <FontAwesomeIcon icon={faHeart} size='1x' />
            </IconButton>
          </Box>
          <Typography fontWeight='bold' py={2}>
            {'ここに説明文など'}
          </Typography>
          <Typography py={2}>（このへんにタグとかtwitterリンクとか諸情報乗っける）</Typography>
          <Box display='flex' gap={2} width='100%' justifyContent='space-evenly'>
            <Button variant='contained' color='inherit' onClick={() => setInfoOpen(false)} fullWidth>
              閉じる
            </Button>
            <Button variant='contained' color='error' onClick={() => router.push('/')} fullWidth>
              トップに戻る
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

export default RoadmapPage
