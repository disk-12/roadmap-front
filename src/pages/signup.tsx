import { Avatar, Box, Button, Grid, Link, Paper, TextField, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { teal } from '@mui/material/colors'
import { NextPage } from 'next'
import { auth, setToken, translateErrorMessage } from 'services/firebase'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import axios from 'axios'
import { useRef, useState } from 'react'
import { FirebaseError } from 'firebase/app'

const Login: NextPage = () => {
  const router = useRouter()
  const emailRef = useRef<HTMLFormElement>()
  const passwordRef = useRef<HTMLFormElement>()
  const usernameRef = useRef<HTMLFormElement>()
  const [errorMsg, setErrorMsg] = useState<string | null>()
  const registerAccountHundler = () => {
    createUserWithEmailAndPassword(auth, emailRef.current?.value, passwordRef.current?.value)
      .then((userCredential) => {
        setToken()
        if (!usernameRef.current?.value) axios.post('/user', { name: 'no name' }).then(({ data }) => data)
        else axios.post('/user', { name: usernameRef.current?.value }).then(({ data }) => data)
      })
      .catch((error) => {
        if (error instanceof FirebaseError) {
          setErrorMsg(translateErrorMessage(error, 'signin'))
        } else {
          console.log(error)
        }
      })
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
            アカウントを作成します
          </Typography>
        </Grid>
        <TextField label='ユーザ名' variant='standard' fullWidth required inputRef={usernameRef} />
        <TextField label='メールアドレス' variant='standard' fullWidth required inputRef={emailRef} />
        <TextField type='password' label='パスワード' variant='standard' fullWidth required inputRef={passwordRef} />
        {/* ラベルとチェックボックス */}

        <Box mt={3}>
          <Typography color={'red'}>{errorMsg}</Typography>
          <Button color='primary' variant='contained' fullWidth onClick={registerAccountHundler}>
            アカウントを作成
          </Button>
        </Box>
        <Box mt={3}>
          <Typography variant='caption' display='block'>
            アカウントを持っていますか？
            <Link href='/register'>ログイン</Link>
          </Typography>
        </Box>
      </Paper>
    </Grid>
  )
}

export default Login
