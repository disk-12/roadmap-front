import type { NextApiRequest, NextApiResponse } from 'next'
import { PRISMA_CLIENT } from 'mock'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return
  const data = await PRISMA_CLIENT.roadmap.findMany({
    take: -20,
    select: { id: true, title: true, summary: true, node: { take: 1, select: { url: true } } },
    orderBy: {
      id: 'desc',
    },
  })
  const list = data.map(({ id, title, summary, node }) => ({ id, title, summary, imgurl: node[0]?.url }))
  res.status(200).json(list)
}
