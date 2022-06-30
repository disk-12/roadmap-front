import { Box } from '@mui/system'
import { FC, ReactNode, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

export const VideoBox: FC<{
  url: string
  startSecond?: number
  endSecond?: number
  onEnd: () => void
}> = ({ url, startSecond, endSecond, onEnd }) => {
  const [emb, setEmb] = useState<ReactNode>(<>loading...</>)
  useEffect(() => {
    setEmb(
      <ReactPlayer
        width='auto'
        url={`https://www.youtube.com/embed/${url}`}
        onEnded={onEnd}
        config={{
          youtube: {
            playerVars: {
              start: startSecond,
              end: endSecond,
              rel: 0,
            },
            embedOptions: {},
          },
        }}
      />
    )
  }, [url, startSecond, endSecond, onEnd])
  return (
    <Box maxWidth='100%' height='100%' textAlign='center' overflow='hidden'>
      {emb}
    </Box>
  )
}
