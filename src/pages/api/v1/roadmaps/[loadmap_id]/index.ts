import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from 'schemaHelper'

const dummyData: ResponseData<'/roadmaps/{roadmap_id}', 'get'> = {
  id: 'hoge',
  author_id: 'hoge',
  title: 'hoge',
  favorited: false,
  favorite_count: 1,
  tags: [],
  edges: [
    {
      id: '1',
      source_id: '1',
      target_id: '2',
      is_solid_line: true,
    },
  ],
  vertexes: [
    {
      id: '1',
      x_coordinate: 100,
      y_coordinate: 50,
    },
    {
      id: '2',
      x_coordinate: 100,
      y_coordinate: 150,
    },
  ],
  created_at: 'hoge',
  updated_at: 'hoge',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return
  res.status(200).json(dummyData)
}
