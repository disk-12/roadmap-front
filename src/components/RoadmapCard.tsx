import { FC } from 'react'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

export const RoadmapCard: FC<{
  id: string | number
  imgUrl?: string
  title: string
  favCount: number
  createdAt: string
}> = ({ id, imgUrl, title, favCount, createdAt }) => {
  return (
    <Box mx={1} my={1} sx={{ cursor: 'pointer' }}>
      <Link href={`/roadmap/read?id=${id}`}>
        <Box
          p={1}
          display='flex'
          bgcolor='white'
          sx={{
            ':hover': { backgroundColor: 'white', transition: '0.2s' },
            transition: '0.2s',
          }}
        >
          <img src={imgUrl && `http://img.youtube.com/vi/${imgUrl}/default.jpg`} width={120} />
          <Box px={1} display='flex' flexDirection='column' textAlign='left' width='100%'>
            <Typography component='h2' fontSize='large' fontWeight='bold'>
              {title}
            </Typography>
            <Box fontSize='smaller' alignItems='center' justifyContent='end' display='flex' width='100%'>
              <FontAwesomeIcon icon={faHeart} />
              <Typography mx={0.5}>{favCount}</Typography>
            </Box>
            <Typography fontSize='smaller' textAlign='right'>
              {createdAt}
            </Typography>
          </Box>
        </Box>
      </Link>
    </Box>
  )
}
