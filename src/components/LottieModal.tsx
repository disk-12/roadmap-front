import { FC } from 'react'
import Lottie, { Options } from 'react-lottie'
import animationData from 'data/107653-trophy.json'
import { Button, Dialog, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { TwitterShareButton } from 'react-share'

export const LottieModal: FC<{ shareText: string; shareUrl: string; title: string; onClose: () => void }> = ({
  title,
  onClose,
  shareText,
  shareUrl,
}) => {
  return (
    <Dialog open maxWidth='md' fullWidth>
      <Box bgcolor='#f5f5f5' display='flex' flexDirection='column' gap={2} width='100%' justifyContent='center' py={2}>
        <Lottie options={defaultOptions} height={300} width={300} />
        <Typography fontWeight='bold' textAlign='center'>
          {title}
        </Typography>
        <Box display='flex' gap={1} width='90%' m='auto'>
          <TwitterShareButton
            url={shareUrl}
            title={shareText}
            style={{
              width: '50%',
              backgroundColor: 'blue',
              color: 'white',
              borderRadius: '4px',
              boxShadow: '2px 5px #1f8cb01f',
            }}
          >
            シェアする
          </TwitterShareButton>
          <Box width='50%'>
            <Button onClick={onClose} variant='contained' fullWidth color='inherit'>
              閉じる
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

const defaultOptions: Options = {
  autoplay: true,
  loop: 0,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}
