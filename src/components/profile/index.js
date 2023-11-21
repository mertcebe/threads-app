import React, { useEffect, useState } from 'react'
import defaultProfileImg from '../../images/twitterProfileImg.png'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { getUser, getUserPosts, getUserReplies } from './profileActions';
import styled from '@emotion/styled';
import { Box, Tabs, Tab, Fade } from '@mui/material';
import Post from '../posts/post';
import SingleCommentContainer from '../posts/comments/SingleCommentContainer';
import { toast } from 'react-toastify';

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
    background: rebeccapurple;
    width: 18px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
`;

const ProfilePage = () => {
    let [profile, setProfile] = useState();
    let [posts, setPosts] = useState([]);
    let [replies, setReplies] = useState([]);
    const [value, setValue] = useState(0);
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
            })
        getUserReplies(id ? id : auth.currentUser.uid)
            .then((snapshot) => {
                setReplies(snapshot);
            })
    }, [id]);

    const handleChange = (event, newValue) => {
        if (!id) {
            setValue(newValue);
        }
        else if (id === auth.currentUser.uid) {
            setValue(newValue);
        }
    };

    if (!profile) {
        return (
            <h5>loading...</h5>
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
                        <small className='m-0 text-secondary' style={{ fontSize: "11px" }}>@{profile.email}</small>
                    </div>
                </div>
                {
                    id ?
                        <>
                            {
                                auth.currentUser.uid === id ?
                                    <MyButton onClick={() => { }}><i className="fa-regular fa-pen-to-square" style={{ fontSize: "14px", marginRight: "6px", color: "rebeccapurple" }}></i>Edit</MyButton>
                                    :
                                    <></>
                            }
                        </>
                        :
                        <MyButton onClick={() => { }}><i className="fa-regular fa-pen-to-square" style={{ fontSize: "14px", marginRight: "6px", color: "rebeccapurple" }}></i>Edit</MyButton>
                }
            </div>

            <div className='my-2 mb-4'>
                <p className='m-0 text-light' style={{ fontSize: "14px", opacity: "0.8" }}>{profile.description}qwddqwdqdw</p>
            </div>
            <hr style={{ color: "grey", margin: "20px 0" }} />

            <Box sx={{ bgcolor: 'rgb(22, 22, 22)', my: 1 }}>
                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="styled tabs example"
                >
                    <StyledTab label={<div style={{ display: "flex", alignContent: "center" }}><i className="fa-regular fa-comment-dots" style={{ marginRight: "10px" }}></i><span>Threads</span><MySpan>{posts?.length}</MySpan></div>} />
                    <StyledTab label={<div style={{ display: "flex", alignContent: "center", opacity: id ? id !== auth.currentUser.uid && '0.4' : '1', cursor: id ? id !== auth.currentUser.uid && 'auto' : 'pointer' }}><i className="fa-solid fa-user-group" style={{ marginRight: "10px" }}></i><span>Replies</span>{id ? id === auth.currentUser.uid &&<MySpan>{replies?.length}</MySpan>:<MySpan>{replies?.length}</MySpan>}</div>} />
                    <StyledTab label={<div style={{ display: "flex", alignContent: "center", opacity: id ? id !== auth.currentUser.uid && '0.4' : '1', cursor: id ? id !== auth.currentUser.uid && 'auto' : 'pointer' }}><i className="fa-solid fa-tag" style={{ marginRight: "10px" }}></i><span>Tags</span></div>} />
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
                    </>
                }
            </div>
        </div>
    )
}

export default ProfilePage