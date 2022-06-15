import type { NextApiRequest, NextApiResponse } from 'next'
import { PRISMA_CLIENT } from 'mock'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id)
  if (req.method !== 'GET' || isNaN(id)) return
  const data = await PRISMA_CLIENT.roadmap.findFirst({
    where: { id },
    select: { title: true, summary: true, node: true, arrow:true },
  })
  res.status(200).json({ ...data })
}
