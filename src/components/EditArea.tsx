import {
  faArrowUp,
  faArrowUpRightDots,
  faCommentMedical,
  faInfoCircle,
  faPenToSquare,
  faTrashCan,
  faUpDownLeftRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { Dispatch, FC, SetStateAction, useRef, useState } from 'react'
import { RequestData } from 'schemaHelper'
import { Arrow } from './Arrow'
import { NodeBox } from './NodeBox'

type Vertexes = RequestData<'/roadmaps', 'post'>['vertexes']
type Edges = RequestData<'/roadmaps', 'post'>['edges']
type EditAreaProps = {
  vertexList: Vertexes
  setVertexList: Dispatch<SetStateAction<Vertexes>>
  edgeList: Edges
  setEdgeList: Dispatch<SetStateAction<Edges>>
  setModalData: Dispatch<SetStateAction<Vertexes[number] | undefined>>
  setDialogOpen: Dispatch<SetStateAction<boolean>>
}

export const EditArea: FC<EditAreaProps> = ({
  vertexList,
  setVertexList,
  edgeList,
  setEdgeList,
  setModalData,
  setDialogOpen,
}) => {
  const [mode, setMode] = useState<'addNode' | 'addMainLine' | 'addSubLine' | 'setNode' | 'info' | 'delete'>('addNode')
  const [nodeId, setNodeId] = useState(0)
  const [addLineTemp, setAddLineTemp] = useState<string | undefined>()
  const ref = useRef<HTMLDivElement | null>(null)
  const addVertexListContents = (x: number, y: number) => {
    setVertexList((l) => [
      ...l,
      {
        id: String(nodeId),
        type: 'DEFAULT',
        x_coordinate: x - (ref.current?.offsetLeft || 0),
        y_coordinate: y,
        title: '',
        content: '',
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
      width='100%'
      height={Math.max(...vertexList.map(({ y_coordinate }) => y_coordinate)) + 300}
      minHeight='100vh'
      textAlign='center'
      sx={{ overflowX: 'hidden' }}
    >
      <Box
        position='relative'
        width='100%'
        maxWidth='300px'
        height='100%'
        minHeight='100vh'
        bgcolor='rgba(255,255,255,0.4)'
        mx='auto'
        onClick={({ pageX, pageY }) => mode === 'addNode' && addVertexListContents(pageX, pageY)}
        fontSize='small'
        ref={ref}
      >
        <Box position='fixed' right={0} bottom={0} p={2} display='grid' onClick={(e) => e.stopPropagation()} gap={1} zIndex={11}>
          <Button color='inherit' variant='contained' disabled>
            <FontAwesomeIcon icon={faUpDownLeftRight} size='lg' />
          </Button>
          {optionList.map((e) => (
            <Button
              key={e.mode}
              color={mode === e.mode ? 'primary' : 'inherit'}
              variant='contained'
              onClick={() => (e.mode === 'info' ? setDialogOpen(true) : setMode(e.mode))}
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
            isActive={
              e.title !== '' &&
              ((e.type === 'YOUTUBE' && e.id !== '') || (e.type === 'LINK' && e.link !== '') || e.type === 'DEFAULT')
            }
            border={addLineTemp === e.id ? '1px dashed orange' : 'none'}
            onClick={(f) => {
              f.stopPropagation()
              if (mode === 'addMainLine' || mode === 'addSubLine') addLineContents(e.id)
              else if (mode === 'setNode') {
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
      </Box>
    </Box>
  )
}

const optionList = [
  { icon: faCommentMedical, mode: 'addNode' },
  { icon: faArrowUp, mode: 'addMainLine' },
  { icon: faArrowUpRightDots, mode: 'addSubLine' },
  { icon: faPenToSquare, mode: 'setNode' },
  { icon: faTrashCan, mode: 'delete' },
  { icon: faInfoCircle, mode: 'info' },
] as const
