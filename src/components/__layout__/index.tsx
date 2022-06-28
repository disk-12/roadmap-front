import { faBell, faHome, faSearch, faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from 'services/firebase'

const fullScreenPage = ['/roadmap/make', '/roadmap/[roadmap_id]']
export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter()
  const isFull = fullScreenPage.includes(router.route)
  return (
    <Box
      height='100vh'
      width='100%'
      maxWidth={!isFull ? '720px' : '100%'}
      textAlign='center'
      margin='auto'
      sx={{
        backgroundImage:
          'linear-gradient(0deg, transparent 31px, #ddd 32px), linear-gradient(90deg,  transparent 31px, #ddd 32px)',
        backgroundSize: '32px 32px',
      }}
    >
      {children}
      {!isFull && <Footer />}
    </Box>
  )
}
type tabList = () => { url: string; title: string; icon: IconDefinition }[]

const Footer = () => {
  const { pathname } = useRouter()
  const [user, loading, error] = useAuthState(auth)

  const makeTabList: tabList = () => {
    return [
      { url: '/', title: 'ホーム', icon: faHome },
      { url: '/search', title: '検索', icon: faSearch },
      user ? { url: '/my', title: 'マイページ', icon: faUser } : { url: '/signin', title: 'ログイン', icon: faUser },
      { url: '/notification', title: '通知', icon: faBell },
    ]
  }

  const tab = makeTabList().findIndex((e) => e.url === pathname)
  return (
    <Box
      bgcolor='white'
      width='100%'
      margin='auto'
      maxWidth='720px'
      position='fixed'
      bottom={0}
      display='flex'
      justifyContent='space-between'
    >
      {makeTabList().map((e, idx) => (
        <Box
          key={idx}
          width='25%'
          py={1}
          sx={{
            transition: '0.2s',
            cursor: 'pointer',
            ':hover': { backgroundColor: 'white', transition: '0.2s' },
          }}
          color={idx === tab ? 'black' : '#ccc'}
        >
          <Link href={e.url}>
            <Box
              width='100%'
              height='100%'
              textAlign='center'
              display='flex'
              flexDirection='column'
              justifyContent='center'
            >
              <FontAwesomeIcon icon={e.icon} size='1x' />
              <Typography paddingTop={0.5} fontSize='xx-small'>
                {e.title}
              </Typography>
            </Box>
          </Link>
        </Box>
      ))}
    </Box>
  )
}

const TabList = [
  { url: '/', title: 'ホーム', icon: faHome },
  { url: '/search', title: '検索', icon: faSearch },
  { url: '/my', title: 'マイページ', icon: faUser },
  { url: '/notification', title: '通知', icon: faBell },
]
