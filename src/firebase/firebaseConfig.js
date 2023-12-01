import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDW5rvYl1udgangFWhW55AcFY-dn_iF7YA",
  authDomain: "reactjs-app-5fba6.firebaseapp.com",
  projectId: "reactjs-app-5fba6",
  storageBucket: "reactjs-app-5fba6.appspot.com",
  messagingSenderId: "161679081150",
  appId: "1:161679081150:web:0d81a6fece24a1ceda28ef",
  measurementId: "G-4PV6E2F3E9"
};

const app = initializeApp(firebaseConfig);

const database = getFirestore();

const auth = getAuth();

export {database as default, auth}