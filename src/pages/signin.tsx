import { Avatar, Box, Button, Grid, Link, Paper, TextField, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { teal } from '@mui/material/colors'
import { NextPage } from 'next'
import { auth, setToken, translateErrorMessage } from 'services/firebase'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

const Login: NextPage = () => {
  const router = useRouter()
  const emailRef = useRef<HTMLFormElement>()
  const passwordRef = useRef<HTMLFormElement>()
  const [errorMsg, setErrorMsg] = useState<string | null>()
  const signInHundler = () => {
    const email = emailRef.current?.value
    const password = passwordRef.current?.value
    const signin = async () => {
      try {
        await signInWithEmailAndPassword(auth, email, password).then(() => {
          setErrorMsg(null)
          setToken().then(() => router.push('/my'))
        })
      } catch (error) {
        if (error instanceof FirebaseError) {
          setErrorMsg(translateErrorMessage(error, 'signin'))
        } else {
          console.log(error)
        }
      }
      setToken()
    }
    signin()
  }
  return (
    <Grid>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          height: '70vh',
          width: '280px',
          m: '20px auto',
        }}
      >
        <Grid
          container
          direction='column'
          justifyContent='flex-start' //多分、デフォルトflex-startなので省略できる。
          alignItems='center'
        >
          <Avatar sx={{ bgcolor: teal[400] }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant={'h5'} sx={{ marginX: '0px', marginY: '30px' }}>
            ログイン
          </Typography>
        </Grid>
        <TextField label='メールアドレス' variant='standard' fullWidth required inputRef={emailRef} />
        <TextField type='password' label='パスワード' variant='standard' fullWidth required inputRef={passwordRef} />
        {/* ラベルとチェックボックス */}

        <Box mt={3}>
          <Typography color={'red'}>{errorMsg}</Typography>
          <Button type='submit' color='primary' variant='contained' fullWidth onClick={signInHundler}>
            ログイン
          </Button>
        </Box>
        <Box mt={3}>
          <Typography variant='caption' display='block'>
            アカウントを持っていませんか？
            <Link href='/signup'>登録</Link>
          </Typography>
          <Typography variant='caption' display='block'>
            （デモ用）
            <Link href='/signinA'>匿名ログイン</Link>
          </Typography>
        </Box>
      </Paper>
    </Grid>
  )
}

export default Login
