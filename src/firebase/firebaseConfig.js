import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaq2IGRwVWhyS144YniKXahGAE3zlwI98",
  authDomain: "threads-app-e61b1.firebaseapp.com",
  projectId: "threads-app-e61b1",
  storageBucket: "threads-app-e61b1.appspot.com",
  messagingSenderId: "284942103501",
  appId: "1:284942103501:web:5b842bd672979784eb4a84",
  measurementId: "G-0SJ64R1TV2"
};

const app = initializeApp(firebaseConfig);

const database = getFirestore();

const auth = getAuth();

export {database as default, auth}