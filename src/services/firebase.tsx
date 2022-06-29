import axios from "axios";
import { FIREBASE_CONFIG } from "env";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";


const app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
const auth = getAuth(app);

const setToken = ()=>{
  if(auth.currentUser){
    auth.currentUser.getIdToken(true).then(
      (idToken) =>{
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
      }
    )
  }
}

export { app,auth,setToken};
