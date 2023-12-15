import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import logoColorful from '../../../images/threads-logo-with-different-colors.png';
import profileImg from '../../../images/twitterProfileImg.png';
import { IconButton } from '@mui/material';
import style from './style.module.css'
import { toast } from 'react-toastify';
import { auth } from '../../../firebase/firebaseConfig';
import { useNavigate } from 'react-router';
import { NavLink, useSearchParams } from 'react-router-dom';
import { getCommentsFrom } from '../postActions';
import Moment from 'react-moment'
import DeleteIcon from '@mui/icons-material/Delete';

const Post = ({ post }) => {
  let [posts, setPosts] = useState();
  let [isLike, setIsLike] = useState();
  let [comments, setComments] = useState();
  const searchParams = useSearchParams()[0].get('id');

  let navigate = useNavigate();

  let isRefreshComments = useSelector((state) => {
    return state.commentReducer.refreshComments;
  })

  useEffect(() => {
    getCommentsFrom(post.id)
      .then((comments) => {
        setComments(comments);
      })
  }, [isRefreshComments]);

  const openCommentSec = () => {
    navigate(`/post?id=${post.id}`);
  }

  const deletePostFunc = () => {

  }

  return (
    <div style={{ display: "flex", alignItems: "start", background: "#161616", margin: "30px 0", padding: "14px", borderRadius: "10px", position: "relative" }}>
      <div>
        <img src={post.owner.photoURL ? post.owner.photoURL : logoColorful} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#161616", position: "relative", zIndex: 20 }} />
      </div>
      <span style={{ width: "2px", height: "50%", position: "absolute", top: "30px", left: "33px", background: "#4a4a4a", zIndex: 1 }}></span>
      <div style={{ marginLeft: "10px" }}>
        <div style={{ marginLeft: "8px" }}>
          <p className='m-0 p-0 text-light'><b>{post.owner.displayName}</b></p>
          <small style={{ color: "#dfdfdf" }}>{post.text}</small>
          {
            auth.currentUser.uid === post.owner.uid &&
            <IconButton style={{ position: "absolute", top: "10px", right: "10px" }} onClick={deletePostFunc}>
              <DeleteIcon sx={{ color: "red", fontSize: "18px" }} />
            </IconButton>
          }
        </div>
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
            <IconButton className={style.iconButton} disabled={searchParams === post.id} onClick={openCommentSec}>
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
        {
          comments?.length !== 0 &&
          <>
            {
              comments &&
              <div style={{ position: "relative", height: "30px", zIndex: 100 }}>
                <div style={{ position: "absolute", display: "flex", alignItems: "center", top: "0", left: "-40px" }}>
                  <div style={{ position: "relative", width: "34px", height: "20px" }}>
                    {
                      comments?.slice(0, 2).map((comment, index) => {
                        return (
                          <NavLink to={auth.currentUser.uid === comment.sender.uid ? `/profile` : `/profile/${comment.sender.uid}`}>
                            <img src={comment.sender.photoURL ? comment.sender.photoURL : profileImg} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%", transform: `translateX(${index * 10}px)`, position: "absolute" }} />
                          </NavLink>
                        )
                      })
                    }
                  </div>
                  <small className='text-light' style={{ opacity: "0.3", fontSize: "14px", cursor: searchParams === post.id ? "context-menu" : "pointer" }} onClick={() => {
                    if (searchParams !== post.id) {
                      navigate(`/post?id=${post.id}`);
                    }
                  }}>{comments?.length} {comments?.length === 1 ? 'reply' : 'replies'}</small>
                </div>
              </div>
            }
          </>
        }
        <div className='text-light' style={{ position: "relative", left: "-30px", display: "flex", alignItems: "center" }}>
          <span style={{ opacity: "0.2" }}>-</span>
          <Moment utc style={{ opacity: "0.2", fontSize: "11px" }}>{post.dateAdded}</Moment>
          {
            post.forWhichCommunity?.id &&
            <span style={{display: "flex", alignItems: "center"}}>
              <span style={{ opacity: "0.2", margin: "0 5px" }}>-</span>
              <NavLink to={`/communities/${post.forWhichCommunity.id}`} style={{ textDecoration: "none", color: "#fff", opacity: "0.7", fontSize: "14px", display: "flex", alignItems: "center" }}>
                <span>{post.forWhichCommunity.communitiesName}</span>
                <img src={post.forWhichCommunity.photoURL.src} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%", marginLeft: "4px", pointerEvents: "none" }} />
              </NavLink>
            </span>
          }
        </div>
      </div>
    </div>
  )
}

export default Post