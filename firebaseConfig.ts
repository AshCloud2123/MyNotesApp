import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBXRP452ESmKXqEubA5W4v4N8veZhb8rt8",
  authDomain: "mynotesapp-b7a12.firebaseapp.com",
  projectId: "mynotesapp-b7a12",
  storageBucket: "mynotesapp-b7a12.appspot.com",
  messagingSenderId: "172334186698",
  appId: "1:172334186698:web:eafdb48b3b5596bb083433"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };