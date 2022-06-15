import { FC } from 'react'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import Link from 'next/link'

export const RoadmapCard: FC<{ id: number; imgUrl: string; title: string; summary: string }> = ({
  id,
  imgUrl,
  title,
  summary,
}) => {
  return (
    <Box mx={1} my={1} sx={{ cursor: 'pointer' }}>
      <Link href={`/roadmap/${id}`}>
        <Box
          p={1}
          display='flex'
          bgcolor='white'
          sx={{
            ':hover': { backgroundColor: 'white', transition: '0.2s' },
            transition: '0.2s',
          }}
        >
          <img src={`http://img.youtube.com/vi/${imgUrl}/default.jpg`} width={120} />
          <Box px={1} display='flex' flexDirection='column' textAlign='left'>
            <Typography component='h2' fontSize='large' fontWeight='bold'>
              {title}
            </Typography>
            <Typography py={1} fontSize='smaller'>
              {summary}
            </Typography>
          </Box>
        </Box>
      </Link>
    </Box>
  )
}
