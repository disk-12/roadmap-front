import type { AppProps } from 'next/app'
import { Layout } from 'components/__layout__'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'
import 'reset.css'

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  )
}

export default MyApp
