import { FC } from 'react'
import { Box, BoxProps } from '@mui/system'

type NodeBoxInterface = BoxProps & {
  title: string
  top: number
  left: number
  isActive: boolean
}

export const NodeBox: FC<NodeBoxInterface> = ({ title, isActive, ...other }) => {
  return (
    <Box
      {...other}
      position='absolute'
      minWidth={150}
      textAlign='center'
      bgcolor={isActive ? 'orange' : '#ca4'}
      color='white'
      sx={{ cursor: 'pointer', transform: 'translate(-50%, -50%)' }}
    >
      {title}
    </Box>
  )
}
