import type { NextApiRequest, NextApiResponse } from 'next'
import { MOCK_ACCOUNT_ID, PRISMA_CLIENT } from 'mock'

type reqBody = {
  title: string
  summary: string
  nodeList: {
    id: number
    x: number
    y: number
    title: string
    url: string
    summary: string
    startSecond?: number
    endSecond?: number
  }[]
  arrowList: {
    from: number
    to: number
    dashed: boolean
  }[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return
  const body: reqBody = req.body
  const { id } = await PRISMA_CLIENT.roadmap.create({
    data: {
      title: body.title,
      summary: body.summary,
      accountId: MOCK_ACCOUNT_ID,
    },
  })

  await PRISMA_CLIENT.node.createMany({
    data: body.nodeList.map((e) => ({
      id: e.id,
      title: e.title,
      summary: e.summary,
      roadmapId: id,
      x: e.x,
      y: e.y,
      url: e.url,
      video_from_sec: e.startSecond,
      video_to_sec: e.endSecond,
    })),
  })

  await PRISMA_CLIENT.arrow.createMany({
    data: body.arrowList.map(({ from, to, dashed }) => ({ roadmapId: id, from_node: from, to_node: to, dashed })),
  })

  res.status(200).json({ message: 'ok' })
}
