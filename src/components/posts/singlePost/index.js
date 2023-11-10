import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Post from '../post'
import { Navigate, useSearchParams } from 'react-router-dom'
import { getCommentsFrom, getCommentsInFrom, getSinglePost, sendCommentTo, sendCommentsInTo } from '../postActions';
import Skeleton from '../../home/skeleton';
import defaultProfileImg from '../../../images/twitterProfileImg.png'
import { toast } from 'react-toastify';
import SingleCommentContainer from '../comments/SingleCommentContainer';
import { auth } from '../../../firebase/firebaseConfig';
import { refreshAllComments, startCommentInCommentFunc } from '../../../reducers/commentReducer/CommentsActions';

const SinglePostPage = () => {
    let [post, setPost] = useState();
    let [text, setText] = useState();
    let [comments, setComments] = useState();
    let [commentIntext, setCommentInText] = useState();
    let searchParams = useSearchParams()[0].get('id');
    let searchParams2 = useSearchParams()[0].get('commentTo');

    let [isRefreshComments, startCommentInComment] = useSelector((state) => {
        return [state.commentReducer.refreshComments, state.commentReducer.commentInComment];
    });
    let dispatch = useDispatch();

    useEffect(() => {
        console.log(startCommentInComment, 'qwerty')
        getSinglePost(searchParams)
            .then((post) => {
                setPost(post);
                console.log(post)
                getCommentsFrom(post.id)
                    .then((comments) => {
                        setComments(comments);
                    })
            })
    }, [startCommentInComment]);

    const sendCommentFunc = async (e) => {
        e.preventDefault();
        let comment = {
            commentText: text,
            dateSended: new Date().getTime(),
            sender: {
                displayName: auth.currentUser.displayName,
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
            }
        };
        setText('');
        await sendCommentTo(post.id, post.owner.uid, comment);
        getCommentsFrom(post.id)
            .then((comments) => {
                setComments(comments);
                refreshAllComments(dispatch, !isRefreshComments);
            })
    }

    const sendCommentInFunc = async (e) => {
        e.preventDefault();
        let comment = {
            commentText: commentIntext,
            dateSended: new Date().getTime(),
            sender: {
                displayName: auth.currentUser.displayName,
                uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL
            }
        };
        setCommentInText('');
        await sendCommentsInTo(post.id, startCommentInComment?.commentIn.id, startCommentInComment?.commentIn.ownerUid, comment);
        //? Burayı hallet
        // getCommentsInFrom(searchParams, startCommentInComment?.commentIn.id)
        //     .then((snapshot) => {
        //         startCommentInCommentFunc(dispatch, {
        //             comments: snapshot,
        //             commentIn: startCommentInComment?.commentIn
        //         });
        //     })
    }

    if (!post) {
        return (
            <div style={{ width: "calc(100% - 534.28px)", padding: "20px 30px" }}>
                <Skeleton />
            </div>
        )
    }
    return (
        <div style={{ width: "calc(100% - 534.28px)", padding: "10px 30px" }}>
            {
                !searchParams2 ?
                    <>
                        {
                            !post.text ?
                                <Navigate to={'/'} />
                                :
                                <>
                                    <Post post={post} />
                                    <div>
                                        {/* input */}
                                        <form style={{ borderTop: "1px solid #161616", borderBottom: "1px solid #161616", padding: "10px 0" }} onSubmit={sendCommentFunc}>
                                            <img src={post.owner.photoURL ? post.owner.photoURL : defaultProfileImg} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                                            <input type="text" value={text} style={{ width: "calc(100% - 150px)", margin: "0 5px", height: "40px", background: "transparent", color: "#fff", outline: "none", border: "none" }} onChange={(e) => {
                                                setText(e.target.value);
                                            }} placeholder='Comment...' />
                                            <button disabled={text ? false : true} style={{ width: "100px", height: "34px", background: "#a675e6", border: "none", outline: "none", color: "#fff", borderRadius: "30px", opacity: text ? '1' : '0.6' }} onClick={sendCommentFunc}>Reply</button>
                                        </form>

                                        <div className='mt-3'>
                                            {
                                                comments?.length > 0 ?
                                                    <>
                                                        {
                                                            comments.map((comment) => {
                                                                return (
                                                                    <SingleCommentContainer comment={comment} />
                                                                )
                                                            })
                                                        }
                                                    </>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </div>
                                </>
                        }
                    </>
                    :
                    <>
                        {
                            startCommentInComment ?
                                <>
                                    <>
                                        <SingleCommentContainer comment={startCommentInComment?.commentIn} />
                                        <div>
                                            {/* input */}
                                            <form style={{ borderTop: "1px solid #161616", borderBottom: "1px solid #161616", padding: "10px 0" }} onSubmit={sendCommentInFunc}>
                                                <img src={post.owner.photoURL ? post.owner.photoURL : defaultProfileImg} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                                                <input type="text" value={commentIntext} style={{ width: "calc(100% - 150px)", margin: "0 5px", height: "40px", background: "transparent", color: "#fff", outline: "none", border: "none" }} onChange={(e) => {
                                                    setCommentInText(e.target.value);
                                                }} placeholder='Comment...' />
                                                <button disabled={commentIntext ? false : true} style={{ width: "100px", height: "34px", background: "#a675e6", border: "none", outline: "none", color: "#fff", borderRadius: "30px", opacity: commentIntext ? '1' : '0.6' }} onClick={sendCommentInFunc}>Reply</button>
                                            </form>

                                            <div className='mt-3' style={{marginLeft: "20px"}}>
                                                {
                                                    startCommentInComment?.comments?.length > 0 ?
                                                        <>
                                                            {
                                                                startCommentInComment?.comments.map((comment) => {
                                                                    return (
                                                                        <SingleCommentContainer comment={comment} />
                                                                    )
                                                                })
                                                            }
                                                        </>
                                                        :
                                                        <></>
                                                }
                                            </div>
                                        </div>
                                    </>
                                </>
                                :
                                <Navigate to={`/post?id=${post.id}`} />
                        }
                    </>
            }


        </div>
    )
}

export default SinglePostPage