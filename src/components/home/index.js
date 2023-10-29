import { signOut } from 'firebase/auth'
import React from 'react'
import { auth } from '../../firebase/firebaseConfig'

const Home = () => {
  return (
    <div style={{width: "calc(100% - 534.28px)"}}>
      <button onClick={() => {
        signOut(auth);
      }}>sign out</button>
      home page
    </div>
  )
}

export default Home