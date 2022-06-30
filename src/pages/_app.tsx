import axios from 'axios'
import type { AppProps } from 'next/app'
import { Layout } from 'components/__layout__'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { FC, ReactNode, useEffect, useState } from 'react'
import { API_ENDPOINT } from 'env'
import { auth, setToken } from 'services/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { request } from 'schemaHelper'
import { UserContext } from 'context'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { createTheme } from '@mui/material'
import 'reset.css'
import 'day'

axios.defaults.baseURL = API_ENDPOINT

const theme = createTheme({
  typography: {
    fontSize: 12,
    h1: { fontSize: 16 },
    h2: { fontSize: 15 },
    h3: { fontSize: 14 },
    h4: { fontSize: 13 },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <UserWrapper>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserWrapper>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

const UserWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useAuthState(auth)
  useEffect(() => {
    if (user) {
      setToken()
    }
  }, [user])
  const { data } = useQuery(['/user', { user }], () =>
    user ? request({ url: '/user', method: 'get' }).then(({ data }) => data) : undefined
  )
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>
}

export default MyApp
