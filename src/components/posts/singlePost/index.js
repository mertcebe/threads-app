import React, { useEffect, useState } from 'react'
import Post from '../post'
import { useSearchParams } from 'react-router-dom'
import { getCommentsFrom, getSinglePost, sendCommentTo } from '../postActions';
import Skeleton from '../../home/skeleton';
import defaultProfileImg from '../../../images/twitterProfileImg.png'
import { toast } from 'react-toastify';
import SingleCommentContainer from '../comments/SingleCommentContainer';
import { auth } from '../../../firebase/firebaseConfig';

const SinglePostPage = () => {
    let [post, setPost] = useState();
    let [text, setText] = useState();
    let [comments, setComments] = useState();
    let searchParams = useSearchParams()[0].get('id');
    useEffect(() => {
        getSinglePost(searchParams)
            .then((post) => {
                setPost(post);
                getCommentsFrom(post.id)
                .then((comments) => {
                    setComments(comments);
                })
            })
    }, []);

    const sendCommentFunc = (e) => {
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
        sendCommentTo(post.id, post.owner.uid, comment);
        setText('');
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
            <Post post={post} />

            <div>
                {/* input */}
                <form style={{borderTop: "1px solid #161616", borderBottom: "1px solid #161616", padding: "10px 0"}} onSubmit={sendCommentFunc}>
                    <img src={post.owner.photoURL?post.owner.photoURL:defaultProfileImg} alt="" style={{width: "40px", height: "40px", borderRadius: "50%"}} />
                    <input type="text" value={text} style={{width: "calc(100% - 150px)", margin: "0 5px", height: "40px", background: "transparent", color: "#fff", outline: "none", border: "none"}} onChange={(e) => {
                        setText(e.target.value);
                    }} placeholder='Comment...' />
                    <button style={{ width: "100px", height: "34px", background: "#a675e6", border: "none", outline: "none", color: "#fff", borderRadius: "30px"}} onClick={sendCommentFunc}>Reply</button>
                </form>

                <div>
                    {
                        comments?.length > 0?
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
        </div>
    )
}

export default SinglePostPage