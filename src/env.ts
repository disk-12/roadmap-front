export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_DOMAIN || 'http://localhost:3000'
export const MOCK_BEARER = process.env.NEXT_PUBLIC_MOCK_BEARER || 'http://localhost:3000'

export const FIREBASE_CONFIG = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID
  };
  
  