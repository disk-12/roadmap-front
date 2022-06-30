import axios from 'axios'
import type { AppProps } from 'next/app'
import { Layout } from 'components/__layout__'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useEffect, useState } from 'react'
import { API_ENDPOINT, MOCK_BEARER } from 'env'
import 'reset.css'
import 'day'

import { auth, setToken } from 'services/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

axios.defaults.baseURL = API_ENDPOINT

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  const [user, loading, error] = useAuthState(auth)
  useEffect(() => {
    if (user) {
      setToken()
    }
  }, [user])

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  )
}

export default MyApp
