import React, { useEffect, useState } from 'react'
import { MyInput } from '../profile/EditPage'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import database, { auth } from '../../firebase/firebaseConfig';
import SingleCommunityContainer from './SingleCommunityContainer';
import Skeleton from './skeleton';
import { useParams } from 'react-router';
import defaultBackImg from '../../images/threadsLogo.png'
import styled from '@emotion/styled';
import { Box, Tabs, Tab, Fade } from '@mui/material';

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

const CommuntiesPage = () => {
    let [communities, setCommunities] = useState();
    let [searchText, setSearchText] = useState('');
    let [community, setCommunity] = useState();
    const [value, setValue] = useState(0);
    const { id } = useParams();
    const getAllCommunities = () => {
        return new Promise((resolve) => {
            getDocs(query(collection(database, `communities`), orderBy('communitiesName', 'asc')))
                .then((snapshot) => {
                    let communities = [];
                    snapshot.forEach((community) => {
                        communities.push({
                            ...community.data(),
                            id: community.id
                        })
                    });
                    resolve(communities);
                })
        })
    }

    const getCommunity = (id) => {
        console.log(id)
        return new Promise((resolve) => {
            getDoc(doc(database, `communities/${id}`))
                .then((snapshot) => {
                    resolve(snapshot.data());
                })
        })
    }

    useEffect(() => {
        getAllCommunities()
            .then((snapshot) => {
                setCommunities(snapshot);
            })
        getCommunity(id)
            .then((snapshot) => {
                setCommunity(snapshot);
            })
    }, [id]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (id) {
        if (!community) {
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
                        <img src={community.photoURL ? community.photoURL.src : defaultBackImg} alt="" style={{ width: "54px", height: "54px", borderRadius: "50%", marginRight: "5px" }} />
                        <div>
                            <h5 style={{ color: "#efefef", margin: "0" }}>{community.communitiesName}</h5>
                            <small className='m-0 text-secondary' style={{ fontSize: "11px" }}>@{community.slugURL}</small>
                        </div>
                    </div>
                    {/* {
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
                    } */}
                </div>

                <div className='my-2 mb-4'>
                    <p className='m-0 text-light' style={{ fontSize: "14px", opacity: "0.8" }}>{community.bio}</p>
                </div>
                <hr style={{ color: "grey", margin: "20px 0" }} />

                <Box sx={{ bgcolor: 'rgb(22, 22, 22)', my: 1 }}>
                    <StyledTabs
                        value={value}
                        onChange={handleChange}
                        aria-label="styled tabs example"
                    >
                        <StyledTab label={<div style={{ display: "flex", alignContent: "center" }}><i className="fa-regular fa-comment-dots" style={{ marginRight: "10px" }}></i><span>Threads</span></div>} />
                        <StyledTab label={<div style={{ display: "flex", alignContent: "center" }}><i className="fa-solid fa-user-group" style={{ marginRight: "10px" }}></i><span>Members</span></div>} />
                        <StyledTab label={<div style={{ display: "flex", alignContent: "center" }}><i className="fa-solid fa-user-plus" style={{ marginRight: "10px" }}></i><span>Requests</span></div>} />
                    </StyledTabs>
                </Box>

                <div>
                    {
                        value === 0 &&
                        <>
                            {/* {
                                posts.map((post) => {
                                    return (
                                        <Post post={post} />
                                    )
                                })
                            } */}
                        </>
                    }
                    {
                        value === 1 &&
                        <>
                            
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
    else {
        if (!communities) {
            return (
                <div style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
                    <Skeleton />
                </div>
            )
        }
        return (
            <div style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
                <h4 style={{ color: "#fff" }}><b>Communities</b></h4>

                <MyInput type='search' style={{ padding: "10px", borderRadius: "10px" }} onChange={(e) => {
                    setSearchText(e.target.value);
                }} placeholder='Search communities' />
                <hr style={{ color: "rebeccapurple" }} />

                <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                    {
                        communities.map((community) => {
                            if (community.communitiesName.toLowerCase().includes(searchText.toLowerCase()) || community.slugURL.toLowerCase().includes(searchText.toLowerCase())) {
                                return (
                                    <SingleCommunityContainer community={community} />
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}

export default CommuntiesPage