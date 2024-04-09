import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCOUFWNYM6OBI4_Ji4V5NWq7iW_BYwkug",
  authDomain: "last-pj-login.firebaseapp.com",
  projectId: "last-pj-login",
  storageBucket: "last-pj-login.appspot.com",
  messagingSenderId: "971195746432",
  appId: "1:971195746432:web:33dea6ecde8fe657acbe65",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
