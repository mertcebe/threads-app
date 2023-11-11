import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import logoColorful from '../../../images/twitterProfileImg.png';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { auth } from '../../../firebase/firebaseConfig';
import { deleteCommentInOf, deleteCommentOf, getCommentsInFrom } from '../postActions';
import { toast } from 'react-toastify';
import { refreshAllComments, startCommentInCommentFunc } from '../../../reducers/commentReducer/CommentsActions';
import logoImage from '../../../images/gifThreads.gif';
import profileImg from '../../../images/twitterProfileImg.png';
import Moment from 'react-moment';

const SingleCommentContainer = ({ comment, type }) => {
    let [isLike, setIsLike] = useState();
    let [isDeleted, setIsDeleted] = useState(false);
    let [loading, setLoading] = useState(false);
    let [commentsIn, setCommentsIn] = useState();

    const searchParams = useSearchParams()[0].get('id');
    const searchParams2 = useSearchParams()[0].get('commentTo');

    let navigate = useNavigate();

    useEffect(() => {
        getCommentsInFrom(searchParams, comment.id)
            .then((snapshot) => {
                setCommentsIn(snapshot);
            })
    }, []);

    const openCommentSec = async () => {
        setLoading(true);
        await getCommentsInFrom(searchParams, comment.id)
            .then((snapshot) => {
                startCommentInCommentFunc(dispatch, {
                    comments: snapshot,
                    commentIn: comment
                });
            })
        setLoading(false);
        navigate(`/post?id=${searchParams}&commentTo=${comment.sender.uid}`)

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

    if (loading) {
        return (
            <img src={logoImage} alt="" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backdropFilter: "blur(1px)", width: "100%", height: "100vh", zIndex: "100" }} />
        )
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
                    {
                        !searchParams2 ?
                            <li>
                                <IconButton onClick={openCommentSec} disabled={searchParams2 === comment.sender.uid ? true : false}>
                                    <i className="fa-regular fa-comment" style={{ fontSize: "16px", color: "#4a4a4a" }}></i>
                                </IconButton>
                            </li>
                            :
                            <></>
                    }
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
                {
                    type !== 'commentIn' ?
                        <>
                            {
                                commentsIn?.length !== 0 ?
                                    <div style={{ height: "28px" }}>
                                        <div style={{ position: "relative", width: "30px", height: "20px", left: "-40px", zIndex: "10" }}>
                                            {
                                                commentsIn?.slice(0, 2).map((comment, index) => {
                                                    return (
                                                        <NavLink to={auth.currentUser.uid === comment.sender.uid ? `/profile` : `/profile/${comment.sender.uid}`}>
                                                            <img src={comment.sender.photoURL ? comment.sender.photoURL : profileImg} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%", transform: `translateX(${index * 10}px)`, position: "absolute" }} />
                                                        </NavLink>
                                                    )
                                                })
                                            }

                                        </div>
                                        <small className='text-light' style={{ position: "relative", left: "-8px", bottom: "22px", opacity: "0.3", fontSize: "14px" }}>{commentsIn?.length} {commentsIn?.length === 1 ? 'reply' : 'replies'}</small>
                                    </div>
                                    :
                                    <></>
                            }
                        </>
                        :
                        <></>
                }
                <div className='text-light' style={{ opacity: "0.2", position: "relative", left: "-30px" }}>
                    <span>-</span>
                    <Moment utc style={{ fontSize: "11px" }}>{comment.dateSended}</Moment>
                </div>
            </div>

        </div>
    )
}

export default SingleCommentContainer