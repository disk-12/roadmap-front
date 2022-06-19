import axios from 'axios'
import type { AppProps } from 'next/app'
import { Layout } from 'components/__layout__'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'
import { API_ENDPOINT, MOCK_BEARER } from 'env'
import 'reset.css'

axios.defaults.baseURL = API_ENDPOINT
axios.defaults.headers.common['Authorization'] = `Bearer ${MOCK_BEARER}`

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
