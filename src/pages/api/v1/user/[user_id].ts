import type { NextApiRequest, NextApiResponse } from 'next'
import { ResponseData } from 'schemaHelper'

const dummyData: ResponseData<'/users/{user_id}', 'get'> = {
  id: '1',
  name: 'hoge',
  last_login_at: '',
  created_at: '',
  updated_at: '',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return
  res.status(200).json(dummyData)
}
