import React, { useEffect, useState } from 'react'
import defaultProfileImg from '../../images/twitterProfileImg.png'
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import database, { auth } from '../../firebase/firebaseConfig';
import { getInvolvedCommunities, getUser, getUserInvitations, getUserPosts, getUserReplies } from './profileActions';
import styled from '@emotion/styled';
import { Box, Tabs, Tab, Fade, Tooltip } from '@mui/material';
import Post from '../posts/post';
import SingleCommentContainer from '../posts/comments/SingleCommentContainer';
import { toast } from 'react-toastify';
import { getNewInvitations, getNewPosts, getNewReplies } from '../posts/postActions';
import { deleteDoc, doc } from 'firebase/firestore';
import InvitationContainer from '../communties/invitations';

const MyButton = styled.button`
    display: flex;
    align-items: center;
    border: none;
    background: #161616;
    color: #efefef;
    padding: 6px 16px;
    font-size: 12px;
    border-radius: 8px;
`;

const StyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: 'rebeccapurple',
    },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        width: '33%',
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-selected': {
            color: '#fff',
            backgroundColor: '#121212',
        },
        '&.Mui-focusVisible': {
            backgroundColor: 'rgba(100, 95, 228, 0.32)',
        },
    }),
);

const MySpan = styled.span`
    display: inline-block;
    margin-left: 10px;
    background: #410e74;
    width: 18px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
`;

const ProfilePage = () => {
    let [profile, setProfile] = useState();
    let [posts, setPosts] = useState([]);
    let [replies, setReplies] = useState([]);
    let [invitations, setInvitations] = useState([]);
    let [involvedCommunities, setInvolvedCommunities] = useState([]);
    let [involvedCommunitiesLength, setInvolvedCommunitiesLength] = useState(4);
    const [value, setValue] = useState(0);
    const [postsLength, setPostsLength] = useState([]);
    const [repliesLength, setRepliesLength] = useState([]);
    const [invitationsLength, setInvitationsLength] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        let time = setTimeout(() => {
            navigate('/profile');
        }, 3000);
        getUser(id ? id : auth.currentUser.uid)
            .then((snapshot) => {
                setProfile(snapshot);
                if (snapshot) {
                    clearTimeout(time);
                }
            })
        getUserPosts(id ? id : auth.currentUser.uid)
            .then((snapshot) => {
                setPosts(snapshot);
                console.log(snapshot);
            })
        getUserReplies(id ? id : auth.currentUser.uid)
            .then((snapshot) => {
                setReplies(snapshot);
            })
        getUserInvitations(id ? id : auth.currentUser.uid)
            .then((snapshot) => {
                setInvitations(snapshot);
            })
        getInvolvedCommunities(id ? id : auth.currentUser.uid)
            .then((snapshot) => {
                setInvolvedCommunities(snapshot);
            })
        getNewPosts()
            .then((snapshot) => {
                setPostsLength(snapshot);
            })
        getNewReplies()
            .then((snapshot) => {
                setRepliesLength(snapshot);
            })
        getNewInvitations()
            .then((snapshot) => {
                setInvitationsLength(snapshot);
            })
    }, [id]);

    const handleChange = (event, newValue) => {
        getUserPosts(id ? id : auth.currentUser.uid)
            .then((snapshot) => {
                setPosts(snapshot);
                console.log(snapshot);
            })
        getUserReplies(id ? id : auth.currentUser.uid)
            .then((snapshot) => {
                setReplies(snapshot);
            })
        getUserInvitations(id ? id : auth.currentUser.uid)
            .then((snapshot) => {
                setInvitations(snapshot);
            })
        if (newValue === 0) {
            postsLength.forEach((post) => {
                deleteDoc(doc(database, `users/${auth.currentUser.uid}/newMoves/${post.id}`));
            })
        }
        if (newValue === 1) {
            repliesLength.forEach((post) => {
                deleteDoc(doc(database, `users/${auth.currentUser.uid}/newMoves/${post.id}`));
            })
        }
        if (!id) {
            setValue(newValue);
        }
        else if (id === auth.currentUser.uid) {
            setValue(newValue);
        }
    };

    if (!profile) {
        return (
            <div style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
                loading...
            </div>
        )
    }
    return (
        <div style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
            {/* profile */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className='d-flex align-items-center'>
                    <img src={profile.photoURL ? profile.photoURL : defaultProfileImg} alt="" style={{ width: "54px", height: "54px", borderRadius: "50%", marginRight: "5px" }} />
                    <div>
                        <h5 style={{ color: "#efefef", margin: "0" }}>{profile.displayName}</h5>
                        <small className='m-0 text-secondary' style={{ fontSize: "11px" }}><Tooltip title={'email'}><span style={{color: "#efefef", cursor: "default"}}><i className="fa-solid fa-at"></i></span></Tooltip>{profile.email}</small>
                    </div>
                </div>
                {
                    id ?
                        <>
                            {
                                auth.currentUser.uid === id ?
                                    <MyButton onClick={() => { navigate('/profile/edit') }}><i className="fa-regular fa-pen-to-square" style={{ fontSize: "14px", marginRight: "6px", color: "rebeccapurple" }}></i>Edit</MyButton>
                                    :
                                    <></>
                            }
                        </>
                        :
                        <MyButton onClick={() => { navigate('/profile/edit') }}><i className="fa-regular fa-pen-to-square" style={{ fontSize: "14px", marginRight: "6px", color: "rebeccapurple" }}></i>Edit</MyButton>
                }
            </div>

            <div className='my-2 mb-4'>
                <p className='m-0 text-light' style={{ fontSize: "14px", opacity: "0.8" }}>{profile.description}</p>

                {
                    auth.currentUser.uid === profile.uid && involvedCommunities.length !== 0 &&
                    <div style={{ margin: "10px 0" }}>
                        <p className='m-0 text-light' style={{ fontSize: "16px" }}>Communities</p>
                        <div className='my-1'>
                            {
                                involvedCommunities.slice(0, involvedCommunitiesLength).map((community) => {
                                    return (
                                        <NavLink to={`/communities/${community.id}`} style={{ color: "#fff", background: "#161616", display: "inline-block", padding: "4px 8px", textDecoration: "none", fontSize: "12px", margin: "0 4px 4px 0" }}>
                                            <img src={community.photoURL.src} alt="" style={{ width: "30px", height: "30px", borderRadius: "50%", pointerEvents: "none" }} />
                                            <span>{community.communitiesName}</span>
                                            <div style={{ color: "lightgray", background: "#000", display: "inline-block", padding: "2px 8px", borderRadius: "4px", marginLeft: "8px", cursor: "default", pointerEvents: "none" }}>
                                                {
                                                    community.role === 'member' ?
                                                        <i className="fa-solid fa-user-large"></i>
                                                        :
                                                        <i className="fa-solid fa-user-gear"></i>
                                                }
                                                <small className='d-inline-block' style={{ marginLeft: "6px", fontWeight: "bold" }}>{community.role}</small>
                                            </div>
                                        </NavLink>
                                    )
                                })
                            }
                            {
                                involvedCommunities.length > 4 && involvedCommunities.length > involvedCommunitiesLength&&
                                <button style={{ background: "transparent", color: "#fff", border: "none", outline: "none", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => {
                                    setInvolvedCommunitiesLength(involvedCommunitiesLength + 4);
                                }}><span className='d-inline-block' style={{ marginRight: "4px", fontSize: "12px" }}>See more</span><i className="fa-solid fa-angle-down" style={{ fontSize: "12px" }}></i></button>
                            }
                        </div>
                    </div>
                }
            </div>
            <hr style={{ color: "grey", margin: "20px 0" }} />

            <Box sx={{ bgcolor: 'rgb(22, 22, 22)', my: 1 }}>
                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="styled tabs example"
                >
                    <StyledTab label={<div style={{ display: "flex", alignContent: "center" }}><i className="fa-regular fa-comment-dots" style={{ marginRight: "10px" }}></i><span>Threads</span>{postsLength.length !== 0 && <MySpan>{postsLength.length}</MySpan>}</div>} />
                    <StyledTab label={<div style={{ display: "flex", alignContent: "center", opacity: id ? id !== auth.currentUser.uid && '0.4' : '1', cursor: id ? id !== auth.currentUser.uid && 'auto' : 'pointer' }}><i className="fa-solid fa-user-group" style={{ marginRight: "10px" }}></i><span>Replies</span>{id ? id === auth.currentUser.uid && repliesLength.length !== 0 && <MySpan>{repliesLength.length}</MySpan> : repliesLength.length !== 0 && <MySpan>{repliesLength.length}</MySpan>}</div>} />
                    <StyledTab label={<div style={{ display: "flex", alignContent: "center", opacity: id ? id !== auth.currentUser.uid && '0.4' : '1', cursor: id ? id !== auth.currentUser.uid && 'auto' : 'pointer' }}><i className="fa-solid fa-tag" style={{ marginRight: "10px" }}></i><span>Invitations</span>{id ? id === auth.currentUser.uid && invitationsLength.length !== 0 && <MySpan>{invitationsLength.length}</MySpan> : invitationsLength.length !== 0 && <MySpan>{invitationsLength.length}</MySpan>}</div>} />
                </StyledTabs>
            </Box>

            <div>
                {
                    value === 0 &&
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
                {
                    value === 1 &&
                    <>
                        {
                            replies.map((reply) => {
                                return (
                                    <SingleCommentContainer comment={reply} type={'reply'} />
                                )
                            })
                        }
                    </>
                }
                {
                    value === 2 &&
                    <>
                        {
                            invitations.map((invitation) => {
                                return (
                                    <InvitationContainer invitation={invitation} />
                                )
                            })
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default ProfilePage