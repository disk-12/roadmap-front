import { FC } from 'react'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'

export const OgpCard: FC<{
  image?: string
  title?: string
  siteName?: string
  url: string
}> = ({ image, title, siteName, url }) => {
  return (
    <Box mx={1} my={1} sx={{ cursor: 'pointer' }}>
      <a href={url} target='noreferrer'>
        <Box
          bgcolor='white'
          boxShadow='1px 1px 1px 1px rgba(0, 0, 0, 0.2)'
          display='flex'
          flexDirection='column'
          gap={0.5}
          sx={{
            ':hover': { backgroundColor: 'white', transition: '0.2s' },
            transition: '0.2s',
          }}
        >
          {image && (
            <Box p={1} mx='auto'>
              <img src={image} style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
            </Box>
          )}
          {title || siteName ? (
            <Box p={1} display='flex' flexDirection='column' justifyContent='space-between'>
              <Typography component='h2' fontSize='large' fontWeight='bold'>
                {title}
              </Typography>
              <Typography p={1} fontSize='smaller' textAlign='right'>
                {siteName}
              </Typography>
            </Box>
          ) : (
            <Typography p={1} fontSize='smaller' textAlign='center'>
              {url}
            </Typography>
          )}
        </Box>
      </a>
    </Box>
  )
}
