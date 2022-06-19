import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from 'schemaHelper'

const dummyData: ResponseData<'/home_timeline', 'get'> = [
  {
    id: '1',
    author_id: '1',
    title: 'お気に入りです',
    favorited: false,
    favorite_count: 3,
    tags: [],
    edges: [],
    vertexes: [],
    created_at: '',
    updated_at: '',
  },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return
  res.status(200).json(dummyData)
}
