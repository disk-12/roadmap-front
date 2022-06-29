import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from 'schemaHelper'

const dummyData: ResponseData<'/roadmaps/{roadmap_id}', 'get'> = {
  id: 'hoge',
  author_id: 'hoge',
  title: 'hoge マップ',
  favorited: false,
  favorite_count: 1,
  tags: ['tag1', 'tag2'],
  locked: false,
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
      type: 'DEFAULT',
      x_coordinate: 100,
      y_coordinate: 350,
      title: 'hoge',
      content: 'hogehogehoge',
      achieved: false,
    },
    {
      id: '2',
      type: 'YOUTUBE',
      x_coordinate: 100,
      y_coordinate: 900,
      youtube_id: 'ncI1wORn9F4',
      youtube_start: 50,
      youtube_end: 55,
      content: 'g1やぞ',
      title: '01 JC',
      achieved: true,
    },
  ],
  created_at: '2022-06-29T22:00:99+09:00',
  updated_at: '2022-06-29T22:00:00+09:00',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return
  res.status(200).json(dummyData)
}
