import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyjJrPpKiHG9VBkMfsGUKI_eoPC_4XHa4",
  authDomain: "react-threads-app.firebaseapp.com",
  projectId: "react-threads-app",
  storageBucket: "react-threads-app.appspot.com",
  messagingSenderId: "771820949852",
  appId: "1:771820949852:web:7fdd6c457c901239173199",
  measurementId: "G-GMN0HXQG3V"
};

const app = initializeApp(firebaseConfig);

const database = getFirestore();

const auth = getAuth();

export {database as default, auth}