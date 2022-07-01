import { FC, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { IconButton, Typography } from '@mui/material'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'

export const RoadmapCard: FC<{
  id: string | number
  imgUrl?: string
  title: string
  favCount: number
  createdAt: string
  onClickDeleteIcon?: (id: string) => void
}> = ({ id, imgUrl, title, favCount, createdAt, onClickDeleteIcon }) => {
  const [img, setImg] = useState(<></>)
  useEffect(() => {
    imgUrl && setImg(<img src={`http://img.youtube.com/vi/${imgUrl}/default.jpg?t=${dayjs().unix()}`} width={120} />)
  }, [imgUrl])

  return (
    <Box mx={1} sx={{ cursor: 'pointer' }}>
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
          <Box bgcolor='#eee' minWidth='120px' height='90px'>
            {img}
          </Box>
          <Box px={1} display='flex' flexDirection='column' textAlign='left' width='100%' justifyContent='space-around'>
            <Box>
              <Typography component='h2' fontWeight='bold'>
                {title}
              </Typography>
              {onClickDeleteIcon && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    onClickDeleteIcon(id.toString())
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              )}
            </Box>
            <Box>
              <Box fontSize='smaller' alignItems='center' justifyContent='end' display='flex' width='100%'>
                <FontAwesomeIcon icon={faHeart} />
                <Typography mx={0.5}>{favCount}</Typography>
              </Box>
              <Typography fontSize='smaller' textAlign='right'>
                {createdAt}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Link>
    </Box>
  )
}
