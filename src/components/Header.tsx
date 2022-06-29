import Head from 'next/head'
import { FC } from 'react'

export const Header: FC<{ title?: string; url?: string }> = ({ title, url }) => {
  const description = 'ロードマップ投稿型学習サイト'
  const metaUrl = url ? url : '/'
  return (
    <Head>
      <title>{title ? `${title} | RoMa` : 'RoMa'}</title>
      <meta name='viewport' content='width=device-width,initial-scale=1.0' />
      <meta name='description' content={description} />
      <meta property='og:url' content={metaUrl} />
      <meta property='og:title' content={title} />
      <meta property='og:site_name' content={'RoMa'} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />
      <meta property='og:image' content={'/favicon.ico'} />
      <meta property='og:image:width' content={'128'} />
      <meta property='og:image:height' content={'128'} />
    </Head>
  )
}
