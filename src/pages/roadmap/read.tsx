import { Box } from '@mui/system'
import { Button, Dialog, IconButton, Typography } from '@mui/material'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Arrow } from 'components/Arrow'
import { NodeBox } from 'components/NodeBox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faFileCircleExclamation, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery } from 'react-query'
import { request, ResponseData } from 'schemaHelper'
import { LottieModal } from 'components/LottieModal'
import { ReadNodeModal } from 'components/NodeModal'
import { Header } from 'components/Header'
import axios, { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { TwitterShareButton } from 'react-share'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { CLIENT_DOMAIN } from 'env'

const RoadmapPage: NextPage<PageProps> = ({ data: defaultData, id }) => {
  const router = useRouter()
  const [modalData, setModalData] = useState<
    ResponseData<'/roadmaps/{roadmap_id}', 'get'>['vertexes'][number] | undefined
  >()
  const [achiveOpen, setAchiveOpen] = useState<{ persent: number; open: boolean; text: string } | null>()

  const { data = defaultData, refetch } = useQuery(['/api/get_single_roadmap', { id }], async () =>
    request({ url: '/roadmaps/{roadmap_id}', method: 'get' }, { '{roadmap_id}': id }).then(({ data }) => data)
  )
  const endList = data.achievement?.vertex_ids || []

  const $postAchieve = useMutation<unknown, unknown, string>(
    ['/roadmaps/{roadmap_id}/vertex/{vertex_id}/achievement', 'post'],
    async (param) =>
      request(
        { url: '/roadmaps/{roadmap_id}/vertex/{vertex_id}/achievement', method: 'post' },
        { '{roadmap_id}': id, '{vertex_id}': param }
      ).then(({ data }) => console.log(data)),
    {
      onSuccess: () =>
        refetch().then(() => {
          setModalData(undefined)
        }),
      onError: (e) => {
        if (e instanceof AxiosError && e.request.status) {
          router.push('/signin')
        }
      },
    }
  )

  const $postFav = useMutation<unknown, unknown, void>(
    ['/roadmaps/{roadmap_id}/favorite', { id, method: 'post' }],
    async () =>
      request({ url: '/roadmaps/{roadmap_id}/favorite', method: 'post' }, { '{roadmap_id}': id }).then(
        ({ data }) => data
      ),
    {
      onSuccess: () => refetch(),
      onError: (e) => {
        if (e instanceof AxiosError && e.request.status) {
          router.push('/signin')
        }
      },
    }
  )

  const $deleteFav = useMutation<unknown, unknown, void>(
    ['/roadmaps/{roadmap_id}/favorite', { id, method: 'delete' }],
    async () =>
      request({ url: '/roadmaps/{roadmap_id}/favorite', method: 'delete' }, { '{roadmap_id}': id }).then(
        ({ data }) => data
      ),
    {
      onSuccess: () => refetch(),
      onError: (e) => {
        if (e instanceof AxiosError && e.request.status) {
          router.push('/signin')
        }
      },
    }
  )

  const nodeList = data.vertexes
  const arrowList = data.edges
  const someLoading = $postFav.isLoading || $deleteFav.isLoading || $postAchieve.isLoading

  const achievementPer = data.achievement?.rate || 0
  const checkAchive = () => {
    const isFirst = achiveOpen === undefined
    if (achievementPer === 100 && (!achiveOpen || achiveOpen.persent !== 100))
      setTimeout(() => setAchiveOpen({ persent: 100, open: !isFirst, text: '100% ??????!' }), 750)
    else if (achievementPer >= 50 && (!achiveOpen || achiveOpen.persent < 50))
      setTimeout(() => setAchiveOpen({ persent: 50, open: !isFirst, text: '50% ??????!' }), 750)
    else if (achiveOpen === undefined) setAchiveOpen(null)
  }

  useEffect(() => {
    checkAchive()
  }, [achievementPer])

  return (
    <Box textAlign='left' width='100%' height='100%' display='flex' flexDirection='column'>
      <Header title={data.title} url={`/roadmap/read?id=${id}`} />
      <Box width='100%' maxWidth='500px' mx='auto' display='flex' justifyContent='space-between' bgcolor='white'>
        <Box p={2} onClick={(e) => e.stopPropagation()} display='grid' gap={1}>
          <Typography fontWeight='bold' component='h1'>
            {data.title}
          </Typography>
          <Typography>???????????????: {dayjs(data.updated_at).format('YYYY/MM/DD')}</Typography>
          <Box display='flex' gap={1}>
            <Typography>??????</Typography>
            {data.tags.map((e) => (
              <Typography key={e}>{e}</Typography>
            ))}
          </Box>
        </Box>
        <Box display='grid' gridTemplateColumns={'1fr 1fr'} gap={1} p={1} alignItems='center'>
          <Box color='blue' width='100%' textAlign='center'>
            <TwitterShareButton
              title={`${data.title} | RoMa`}
              url={typeof window !== 'undefined' ? location?.href : ''}
              disabled={someLoading}
            >
              <FontAwesomeIcon icon={faTwitter} size='2x' />
            </TwitterShareButton>
          </Box>
          <IconButton
            color='primary'
            onClick={() => router.push(`/roadmap/edit?id=${id}`)}
            disabled={data.locked || someLoading}
          >
            <FontAwesomeIcon icon={faFileCircleExclamation} size='1x' />
          </IconButton>
          <IconButton color={'warning'} onClick={() => router.push('/')} disabled={someLoading}>
            <FontAwesomeIcon icon={faCircleArrowLeft} size='1x' />
          </IconButton>
          <IconButton
            color={data?.favorited ? 'warning' : 'default'}
            onClick={() => (data?.favorited ? $deleteFav.mutate() : $postFav.mutate())}
            disabled={someLoading}
          >
            <FontAwesomeIcon icon={faHeart} size='1x' />
          </IconButton>
        </Box>
      </Box>
      <Box
        position='relative'
        width='100%'
        maxWidth='300px'
        mx='auto'
        bgcolor='#ffffff66'
        flexGrow={1}
        flexBasis={0}
        sx={{ overflowY: 'scroll' }}
      >
        {nodeList.map((e) => (
          <NodeBox
            key={e.id}
            top={e.y_coordinate}
            left={e.x_coordinate}
            title={e.title}
            p={1}
            zIndex={1}
            onClick={() => setModalData(e)}
            isActive={endList.includes(e.id)}
          />
        ))}
        {arrowList.map((e) => {
          const fromNode = nodeList.find(({ id }) => id === e.source_id)
          const toNode = nodeList.find(({ id }) => id === e.target_id)
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
              <Typography fontWeight='bold' component='h2'>
                {modalData.title}
              </Typography>
              <Button color='error' variant='outlined' onClick={() => setModalData(undefined)}>
                x
              </Button>
            </Box>
            <ReadNodeModal
              modalData={modalData}
              setModalData={setModalData}
              postEndRequest={() => $postAchieve.mutate(modalData.id)}
            />
            <Box px={3} py={1}>
              <Typography py={1}>{modalData.content}</Typography>
            </Box>
          </Box>
        </Dialog>
      )}
      {achiveOpen?.open && (
        <LottieModal
          shareText={`${data.title} | RoMa`}
          shareUrl={typeof window !== 'undefined' ? location.href : ''}
          title={achiveOpen.text}
          onClose={() => setAchiveOpen({ ...achiveOpen, open: false })}
        />
      )}
    </Box>
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

export default RoadmapPage
