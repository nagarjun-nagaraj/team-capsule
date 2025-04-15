
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1QW9wEtRFPqW_8AZZ6LgJnl9wYlCcQ5k",
  authDomain: "team-time-capsule.firebaseapp.com",
  projectId: "team-time-capsule",
  storageBucket: "team-time-capsule.appspot.com",
  messagingSenderId: "891234567890",
  appId: "1:891234567890:web:a1b2c3d4e5f6a7b8c9d0e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
