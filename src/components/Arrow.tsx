import { Box, BoxProps } from '@mui/system'
import { FC } from 'react'

type ArrowInterface = BoxProps & {
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
  dashed: boolean
}

export const Arrow: FC<ArrowInterface> = ({ from, to, dashed, ...other }) => {
  const isRight = from.x < to.x
  const isDown = from.y < to.y
  const isRightDown = (isRight && isDown) || (!isRight && !isDown)
  const p = {
    top: Math.min(from.y, to.y),
    left: Math.min(from.x, to.x),
    height: Math.max(from.y, to.y) - Math.min(from.y, to.y),
    width: Math.max(from.x, to.x) - Math.min(from.x, to.x),
  }
  const color = 'orange'
  const borderType = dashed ? 'dashed' : 'solid'
  const borderStyle = `2px ${borderType} ${color}`
  const border = isRightDown
    ? {
        borderLeft: borderStyle,
        borderBottom: borderStyle,
        borderRadius: '0 100% 0 100%',
      }
    : {
        borderBottom: borderStyle,
        borderRight: borderStyle,
        borderRadius: '100% 0 100% 0',
      }
  return <Box {...other} {...p} position='absolute' {...border} />
}
