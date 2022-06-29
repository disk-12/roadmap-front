import { Avatar, Box, Button, Grid, Paper, TextField, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { teal } from '@mui/material/colors'
import { NextPage } from 'next'
import { auth, setToken } from 'services/firebase'
import { useRouter } from 'next/router'
import { signInAnonymously } from 'firebase/auth'
import axios from 'axios'
import { useRef } from 'react'

const AnonymousLogin: NextPage = () => {
  const router = useRouter()
  const usernameRef = useRef<HTMLFormElement>()
  const signInAnonymouslyHundler = () => {
    signInAnonymously(auth)
      .then(() => {
        setToken()
        axios.post('/user', { name: usernameRef.current?.value }).then(({ data }) => data)
        router.push('/my')
      })
      .catch((error: any) => {
        console.log(error)
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
            匿名ログイン
          </Typography>
        </Grid>
        <TextField label='ユーザ名' variant='standard' fullWidth required inputRef={usernameRef} />

        {/* ラベルとチェックボックス */}

        <Box mt={3}>
          <Button type='submit' color='primary' variant='contained' fullWidth onClick={signInAnonymouslyHundler}>
            ログイン
          </Button>
        </Box>
      </Paper>
    </Grid>
  )
}

export default AnonymousLogin
