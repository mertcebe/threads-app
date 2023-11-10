import { signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import database, { auth } from '../../firebase/firebaseConfig'
import Post from '../posts/post';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getAllPosts } from '../posts/postActions';
import loadingGif from '../../images/gifThreads.gif';
import Skeleton from './skeleton';

const Home = () => {
  let [posts, setPosts] = useState([]);
  let [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getAllPosts()
      .then((posts) => {
        setPosts(posts);
        setLoading(false)
      })
  }, []);
  return (
    <div style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
      <h4 style={{ color: "#fff" }}><b>Home</b></h4>
      <button onClick={() => {signOut(auth)}}>sign out</button>

      <div>
        {
          loading ?
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
            :
            <>
              {
                posts.map((post) => {
                  return (
                    <Post post={post} />
                  )
                })
              }
            </>
        }
      </div>
    </div>
  )
}

export default Home