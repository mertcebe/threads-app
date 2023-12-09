import React, { useEffect, useState } from 'react'
import { MyInput } from '../profile/EditPage'
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import database, { auth } from '../../firebase/firebaseConfig';
import SingleCommunityContainer from './SingleCommunityContainer';
import Skeleton from './skeleton';
import { useNavigate, useParams } from 'react-router';
import defaultBackImg from '../../images/threadsLogo.png'
import styled from '@emotion/styled';
import { Box, Tabs, Tab, Fade, MenuItem, ListItemIcon, Menu, Tooltip, IconButton, Avatar } from '@mui/material';
import SearchUserContainer from '../search/SearchUserContainer';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Add from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { toast } from 'react-toastify';
import ApplicationUserContainer from './ApplicationUserContainer';

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
    let [communityMembers, setCommunityMembers] = useState();
    let [communityAdmins, setCommunityAdmins] = useState();
    let [communityApplications, setCommunityApplications] = useState();
    let [allMembers, setAllMembers] = useState([]);
    const [value, setValue] = useState(0);
    const { id } = useParams();
    // apply component
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

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
        return new Promise((resolve) => {
            getDoc(doc(database, `communities/${id}`))
                .then((snapshot) => {
                    resolve(snapshot.data());
                })
        })
    }

    const getCommunityMembers = async (id) => {
        return new Promise((resolve) => {
            getDocs(query(collection(database, `communities/${id}/members`)), orderBy('dateAccepted', 'desc'))
                .then((snapshot) => {
                    let members = [];
                    snapshot.forEach((member) => {
                        members.push(member.data());
                        allMembers.push(member.data().uid);
                    })
                    resolve(members);
                })
        })
    }

    const getCommunityAdmins = async (id) => {
        return new Promise((resolve) => {
            getDocs(query(collection(database, `communities/${id}/admins`)))
                .then((snapshot) => {
                    let members = [];
                    snapshot.forEach((member) => {
                        members.push(member.data());
                        allMembers.push(member.data().uid);
                    })
                    resolve(members);
                })
        })
    }

    const getCommunityApplications = (id) => {
        return new Promise((resolve) => {
            getDocs(query(collection(database, `communities/${id}/communitiesApplications`)), orderBy('dateSended', 'desc'))
                .then((snapshot) => {
                    let members = [];
                    snapshot.forEach((member) => {
                        members.push(member.data());
                    })
                    resolve(members);
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
        getCommunityMembers(id)
            .then((snapshot) => {
                setCommunityMembers(snapshot);
            })
        getCommunityAdmins(id)
            .then((snapshot) => {
                setCommunityAdmins(snapshot);
            })
        getCommunityApplications(id)
            .then((snapshot) => {
                setCommunityApplications(snapshot);
                console.log(snapshot)
            })
    }, [id]);

    const handleChange = (event, newValue) => {
        getCommunityMembers(id)
            .then((snapshot) => {
                setCommunityMembers(snapshot);
            })
        getCommunityAdmins(id)
            .then((snapshot) => {
                setCommunityAdmins(snapshot);
            })
        setValue(newValue);
    };

    const sendApplicationFunc = (role) => {
        handleClose();
        const application = {
            community: community,
            dateSended: new Date().getTime(),
            role: role,
            message: `I would like to be in your community called ${community.communitiesName}.`,
            sendedUser: {
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                uid: auth.currentUser.uid,
                photoURL: auth.currentUser.photoURL
            }
        };
        getDoc(doc(database, `communities/${id}/communitiesApplications/${auth.currentUser.uid}`))
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    setDoc(doc(database, `communities/${id}/communitiesApplications/${auth.currentUser.uid}`), application)
                        .then(() => {
                            toast.dark('Application was sended!');
                        })
                }
                else {
                    toast.dark('You already applied for this job!');
                }
            })
    }

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
                    {
                        id &&
                        <>
                            {
                                auth.currentUser.uid === community.admin?.uid ?
                                    <MyButton onClick={() => { navigate(`/communities/${id}/edit`) }}><i className="fa-regular fa-pen-to-square" style={{ fontSize: "14px", marginRight: "6px", color: "rebeccapurple" }}></i>Edit</MyButton>
                                    :
                                    <>
                                        {
                                            !allMembers.includes(auth.currentUser.uid) &&
                                            <>
                                                <Tooltip title="Apply for community">
                                                    <MyButton
                                                        onClick={handleClick}
                                                        size="small"
                                                        sx={{ ml: 2 }}
                                                        aria-controls={open ? 'account-menu' : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={open ? 'true' : undefined}
                                                    >
                                                        Apply
                                                    </MyButton>
                                                </Tooltip>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    id="account-menu"
                                                    open={open}
                                                    onClose={handleClose}
                                                    onClick={handleClose}
                                                    PaperProps={{
                                                        elevation: 0,
                                                        sx: {
                                                            overflow: 'visible',
                                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                            mt: 1.5,
                                                            '& .MuiAvatar-root': {
                                                                width: 32,
                                                                height: 32,
                                                                ml: -0.5,
                                                                mr: 1,
                                                            },
                                                            '&:before': {
                                                                content: '""',
                                                                display: 'block',
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 14,
                                                                width: 10,
                                                                height: 10,
                                                                bgcolor: 'background.paper',
                                                                transform: 'translateY(-50%) rotate(45deg)',
                                                                zIndex: 0,
                                                            },
                                                        },
                                                    }}
                                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                                >
                                                    <MenuItem onClick={() => {
                                                        sendApplicationFunc('member');
                                                    }}>
                                                        <ListItemIcon>
                                                            <PersonIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        Apply for Member position
                                                    </MenuItem>
                                                    <MenuItem onClick={() => {
                                                        sendApplicationFunc('admin');
                                                    }}>
                                                        <ListItemIcon>
                                                            <ManageAccountsIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        Apply for Admin position
                                                    </MenuItem>
                                                </Menu>
                                            </>
                                        }
                                    </>
                            }
                        </>
                    }
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
                        {
                            auth.currentUser.uid === community.admin?.uid ?
                                <StyledTab label={<div style={{ display: "flex", alignContent: "center" }}><i className="fa-solid fa-user-plus" style={{ marginRight: "10px" }}></i><span>Requests</span></div>} />
                                :
                                <StyledTab label={<div style={{ display: "flex", alignContent: "center" }}><i className="fa-solid fa-user-plus" style={{ marginRight: "10px" }}></i><span>Info</span></div>} />
                        }
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
                            {
                                communityAdmins.map((member) => {
                                    return (
                                        <SearchUserContainer user={member} />
                                    )
                                })
                            }
                            {
                                communityMembers.map((member) => {
                                    return (
                                        <SearchUserContainer user={member} />
                                    )
                                })
                            }
                        </>
                    }
                    {
                        value === 2 &&
                        <>
                            {
                                communityApplications.map((member) => {
                                    return (
                                        <ApplicationUserContainer user={member} />
                                    )
                                })
                            }
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