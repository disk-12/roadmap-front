import axios from 'axios'
import { JSDOM } from 'jsdom'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return
  const url = req.query.url
  if (typeof url !== 'string') {
    res.status(400).json({ message: 'urlおかしいよー' })
    return
  }
  const data = await getOgpFromExternalWebsite(url)
  data ? res.status(200).json(data) : res.status(400).json({ message: 'urlおかしいよー' })
}

export const getOgpFromExternalWebsite = async (query: string) => {
  const encodedUri = encodeURI(query)
  const headers = { 'User-Agent': 'bot' }

  try {
    const res = await axios.get(encodedUri, { headers: headers })
    const html = res.data
    const dom = new JSDOM(html)
    const meta = dom.window.document.head.querySelectorAll('meta')
    const ogp = extractOgp([...meta])
    return {
      image: (ogp['og:image'] as string) || '',
      siteName: (ogp['og:site_name'] as string) || '',
      title: (ogp['og:title'] as string) || '',
    }
  } catch (error) {
    return null
  }
}

const extractOgp = (metaElements: HTMLMetaElement[]) => {
  const ogp = metaElements
    .filter((element: Element) => element.hasAttribute('property'))
    .reduce((previous: any, current: Element) => {
      const property = current.getAttribute('property')?.trim()
      if (!property) return
      const content = current.getAttribute('content')
      previous[property] = content
      return previous
    }, {})
  return ogp
}
