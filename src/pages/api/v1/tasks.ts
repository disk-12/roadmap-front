import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json([{ id: 1, name: 'hoge' }])
    return
  }
  if (req.method === 'POST') {
    res.status(200).json({ status: 'ok' })
  }
}
