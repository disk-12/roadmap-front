import axios from 'axios'
import { API_ENDPOINT } from 'env'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return
  const id = req.query.id
  const headers = { 'User-Agent': 'bot' }
  try {
    const data = await (await axios.get(`/roadmaps/${id}`, { params: { headers }, baseURL: API_ENDPOINT })).data
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json({ message: 'idおかしいよー' })
  }
}
