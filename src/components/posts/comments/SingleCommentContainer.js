import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import logoColorful from '../../../images/twitterProfileImg.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { auth } from '../../../firebase/firebaseConfig';
import { deleteCommentInOf, deleteCommentOf, getCommentsInFrom } from '../postActions';
import { toast } from 'react-toastify';
import { refreshAllComments, startCommentInCommentFunc } from '../../../reducers/commentReducer/CommentsActions';

const SingleCommentContainer = ({ comment }) => {
    let [isLike, setIsLike] = useState();
    let [isDeleted, setIsDeleted] = useState(false);

    const searchParams = useSearchParams()[0].get('id');
    const searchParams2 = useSearchParams()[0].get('commentTo');

    let navigate = useNavigate();

    const openCommentSec = () => {
        navigate(`/post?id=${searchParams}&commentTo=${comment.sender.uid}`)
        getCommentsInFrom(searchParams, comment.id)
            .then((snapshot) => {
                startCommentInCommentFunc(dispatch, {
                    comments: snapshot,
                    commentIn: comment
                });
            })
    }

    let [isRefreshComments, startCommentInComment] = useSelector((state) => {
        return [state.commentReducer.refreshComments, state.commentReducer.commentInComment];
    });
    let dispatch = useDispatch();

    const deleteComment = () => {
        if (!searchParams2) {
            deleteCommentOf(`${comment.postId}`, `${comment.ownerUid}`, `${comment.id}`)
                .then(() => {
                    setIsDeleted(true);
                    refreshAllComments(dispatch, !isRefreshComments);
                })
        }
        else {
            console.log(startCommentInComment)
            deleteCommentInOf(comment.postId, comment.sender.uid, startCommentInComment?.commentIn.id, comment.id)
                .then(() => {
                    setIsDeleted(true);
                    refreshAllComments(dispatch, !isRefreshComments);
                })
        }
    }

    return (
        <div style={{ display: "flex", alignItems: "start", margin: "0", padding: "10px 14px", borderRadius: "10px", position: "relative", opacity: isDeleted ? '0.4' : '1', pointerEvents: isDeleted && 'none' }}>
            <div>
                <img src={comment.sender.photoURL ? comment.sender.photoURL : logoColorful} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", position: "relative", zIndex: 20 }} />
            </div>
            <span style={{ width: "1px", height: "50%", position: "absolute", top: "30px", left: "31px", background: "#4a4a4a", zIndex: 1 }}></span>
            <div style={{ marginLeft: "10px" }}>
                <div style={{ marginLeft: "8px" }}>
                    {
                        auth.currentUser.uid === comment.sender.uid &&
                        <IconButton style={{ position: "absolute", top: "10px", right: "10px" }} onClick={deleteComment}>
                            <DeleteIcon sx={{ color: "red", fontSize: "18px" }} />
                        </IconButton>
                    }
                    <p className='m-0 p-0 text-light'><b>{comment.sender.displayName}</b></p>
                    <small style={{ color: "#dfdfdf" }}>{comment.commentText}</small>
                </div>
                <ul style={{ display: 'flex', listStyle: 'none', alignItems: 'center', padding: 0, margin: 0, marginTop: '10px' }}>
                    <li>
                        <input type="checkbox" id={`chForLike${comment.id}`} checked={isLike} style={{ display: "none" }} />
                        <IconButton style={{ cursor: "pointer" }} onClick={(e) => {
                            setIsLike(!isLike);
                        }}>
                            <i className="fa-regular fa-heart" style={{ color: isLike ? '#ff3a3a' : '#4a4a4a', fontSize: "16px" }}></i>
                        </IconButton>
                    </li>
                    <li>
                        <IconButton onClick={openCommentSec} disabled={searchParams2 === comment.sender.uid ? true : false}>
                            <i className="fa-regular fa-comment" style={{ fontSize: "16px", color: "#4a4a4a" }}></i>
                        </IconButton>
                    </li>
                    <li>
                        <IconButton>
                            <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "16px", color: "#4a4a4a" }}></i>
                        </IconButton>
                    </li>
                    <li>
                        <IconButton>
                            <i className="fa-regular fa-paper-plane" style={{ fontSize: "16px", color: "#4a4a4a" }}></i>
                        </IconButton>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default SingleCommentContainer