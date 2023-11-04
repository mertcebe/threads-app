import { signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import database, { auth } from '../../firebase/firebaseConfig'
import Post from '../posts/post';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const Home = () => {
  let [posts, setPosts] = useState([]);
  useEffect(() => {
    getDocs(query(collection(database, `allPosts`), orderBy('dateAdded', 'desc')))
    .then((snapshot) => {
      let posts = [];
      snapshot.forEach((item) => {
        posts.push(item.data());
      })
      setPosts(posts);
    })
  }, []);
  return (
    <div style={{width: "calc(100% - 534.28px)", padding: "40px 30px"}}>
      <h4 style={{ color: "#fff" }}><b>Home</b></h4>
      
      <div>
        {
          posts.map((post) => {
            return (
              <Post post={post} />
            )
          })
        }
      </div>
    </div>
  )
}

export default Home