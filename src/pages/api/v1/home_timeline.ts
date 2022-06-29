import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from 'schemaHelper'

const dummyData: ResponseData<'/home_timeline', 'get'> = [
  {
    id: 'hoge',
    author_id: 'hoge',
    title: 'タイムライン',
    favorited: false,
    favorite_count: 1,
    tags: [],
    locked: false,
    created_at: '',
    updated_at: '',
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
        y_coordinate: 259,
        title: 'hoge',
        content: 'hogehogehoge',
        achieved: false,
      },
      {
        id: '2',
        type: 'YOUTUBE',
        x_coordinate: 100,
        y_coordinate: 250,
        youtube_id: 'ncI1wORn9F4',
        youtube_start: 50,
        youtube_end: 55,
        content: 'g1やぞ',
        title: '01 JC',
        achieved: false,
      },
    ],
  },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return
  res.status(200).json(dummyData)
}
