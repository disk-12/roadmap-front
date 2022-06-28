import axios from 'axios'
import { FIREBASE_CONFIG } from 'env'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApps()[0]
const auth = getAuth(app)

auth.onIdTokenChanged(function (user) {
  if (user) {
    setToken()
  }
})

const setToken = async () => {
  if (auth.currentUser) {
    const idToken = await auth.currentUser.getIdToken(true)
    axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`
    return true
  }
  return false
}

export { app, auth, setToken }
