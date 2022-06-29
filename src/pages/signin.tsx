import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { teal } from "@mui/material/colors";
import { NextPage } from "next";
import { auth, setToken } from "services/firebase";
import { useRouter } from 'next/router'
import { useRef } from "react";
import {signInWithEmailAndPassword} from "firebase/auth";

const Login: NextPage = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLFormElement>();
  const passwordRef = useRef<HTMLFormElement>();
  const  signInHundler = ()=>{
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    try {
      signInWithEmailAndPassword(auth,email, password).then()
    } catch (error) {
        alert(error)
    }
    setToken();
  }
  return (
    <Grid>
    <Paper
      elevation={3}
      sx={{
        p: 4,
        height: "70vh",
        width: "280px",
        m: "20px auto"
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="flex-start" //多分、デフォルトflex-startなので省略できる。
        alignItems="center"
      >
        <Avatar sx={{ bgcolor: teal[400] }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant={"h5"} sx={{ m: "30px" }}>
          ログイン
        </Typography>
      </Grid>
      <TextField label="メールアドレス" variant="standard" fullWidth required inputRef={emailRef}/>
      <TextField
        type="password"
        label="パスワード"
        variant="standard"
        fullWidth
        required
        inputRef={passwordRef}
        
      />
      {/* ラベルとチェックボックス */}
      
      <Box mt={3}>
        <Button type="submit" color="primary" variant="contained" fullWidth onClick={signInHundler}>
          ログイン
        </Button>

        <Typography variant="caption" display="block">
          アカウントを持っていませんか？
          <Link href="/signup">アカウントを作成</Link>
        </Typography>
        <Typography variant="caption" display="block">
          （デモ用）
          <Link href="/signinA">匿名ログイン</Link>
        </Typography>
      </Box>
    </Paper>
  </Grid>
  )
  
}

export default Login

