import React, { useState } from 'react'
import logoColorful from '../../../images/threads-logo-with-different-colors.png';
import { IconButton } from '@mui/material';
import style from './style.module.css'
import { toast } from 'react-toastify';
import { auth } from '../../../firebase/firebaseConfig';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

const Post = ({ post }) => {
  let [posts, setPosts] = useState();
  let [isLike, setIsLike] = useState();

  let navigate = useNavigate();

  const openCommentSec = () => {
    navigate(`/post?id=${post.id}`);
  }

  return (
    <div style={{ display: "flex", alignItems: "start", background: "#161616", margin: "30px 0", padding: "14px", borderRadius: "10px", position: "relative" }}>
      <div>
        <img src={post.owner.photoURL ? post.owner.photoURL : logoColorful} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#161616", position: "relative", zIndex: 20 }} />
      </div>
      <span style={{ width: "2px", height: "50%", position: "absolute", top: "30px", left: "33px", background: "#4a4a4a", zIndex: 1 }}></span>
      <div style={{ marginLeft: "10px" }}>
        <p className='m-0 p-0 text-light'><b>{post.owner.displayName}</b></p>
        <small style={{ color: "#dfdfdf" }}>{post.text}</small>
        <ul className={`${style.ulEl}`}>
          <li>
            <input type="checkbox" id={`chForLike${post.id}`} checked={isLike} style={{ display: "none" }} />
            <IconButton style={{ cursor: "pointer" }} onClick={(e) => {
              setIsLike(!isLike);
            }}>
              <i className="fa-regular fa-heart" style={{ color: isLike ? '#ff3a3a' : '#4a4a4a', fontSize: "18px" }}></i>
            </IconButton>
          </li>
          <li>
            <IconButton className={style.iconButton} disabled={useSearchParams()[0].get('id') === post.id} onClick={openCommentSec}>
              <i className="fa-regular fa-comment" style={{ fontSize: "18px", color: "#4a4a4a" }}></i>
            </IconButton>
          </li>
          <li>
            <IconButton>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "18px", color: "#4a4a4a" }}></i>
            </IconButton>
          </li>
          <li>
            <IconButton>
              <i className="fa-regular fa-paper-plane" style={{ fontSize: "18px", color: "#4a4a4a" }}></i>
            </IconButton>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Post