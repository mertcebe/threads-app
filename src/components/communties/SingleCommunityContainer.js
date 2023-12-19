import React, { useEffect, useState } from 'react'
import defaultBackImg from '../../images/threadsLogo.png';
import { MyViewButton } from '../search/SearchUserContainer';
import { useNavigate } from 'react-router';
import { collection, getDocs, query } from 'firebase/firestore';
import database from '../../firebase/firebaseConfig';
import defaultProfileImg from '../../images/twitterProfileImg.png'
import { Tooltip } from '@mui/material';

const SingleCommunityContainer = ({ community }) => {
    const [allCommunityAdmins, setAllCommunityAdmins] = useState([]);
    let navigate = useNavigate();

    const getCommunityAdmins = async (id) => {
        getDocs(query(collection(database, `communities/${id}/admins`)))
            .then((snapshot) => {
                let communityAdmins = [];
                snapshot.forEach((member) => {
                    communityAdmins.push(member.data());
                })
                setAllCommunityAdmins(communityAdmins);
            })
    }

    useEffect(() => {
        getCommunityAdmins(community.id)
    }, []);

    return (
        <div style={{ width: "49%", background: "#161616", margin: "0.5%", boxSizing: "border-box", padding: "10px", borderRadius: "5px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <img src={community.photoURL ? community.photoURL.src : defaultBackImg} alt="" style={{ width: "50px", height: "50px", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ marginLeft: "10px" }}>
                    <small className='d-block' style={{ fontWeight: "bold", color: "#efefef" }}>{community.communitiesName}</small>
                    <small className='d-block' style={{ color: "grey", fontSize: "10px" }}>@{community.slugURL}</small>
                </div>
            </div>
            <div style={{ margin: "10px 0" }}>
                {
                    community.bio &&
                    <small className='d-block' style={{ color: "grey" }}>{community.bio.slice(0, 70)}{community.bio.length >= 70 && '..'}</small>
                }
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <MyViewButton onClick={() => {
                    navigate(`/communities/${community.id}`)
                }}>View</MyViewButton>
                <div>
                    {
                        allCommunityAdmins.map((user) => {
                            return (
                                <Tooltip title={user.email}>
                                    <img src={user.photoURL?user.photoURL:defaultProfileImg} alt="" style={{width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer"}} onClick={() => {
                                        navigate(`/profile/${user.uid}`);
                                    }} />
                                </Tooltip>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default SingleCommunityContainer