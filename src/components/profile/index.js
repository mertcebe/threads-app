import React, { useEffect, useState } from 'react'
import defaultProfileImg from '../../images/twitterProfileImg.png'
import { useParams, useSearchParams } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfig';
import { getUser } from './profileActions';
import styled from '@emotion/styled';

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

const ProfilePage = () => {
    let [profile, setProfile] = useState();
    const { id } = useParams();
    useEffect(() => {
        getUser(id ? id : auth.currentUser.uid)
            .then((snapshot) => {
                setProfile(snapshot);
            })
    }, [id]);

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
                    <img src={profile.photoURL ? profile.photoURL : defaultProfileImg} alt="" style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "5px" }} />
                    <h5 style={{ color: "#efefef" }}>{profile.displayName}</h5>
                </div>
                <MyButton onClick={() => {}}><i className="fa-regular fa-pen-to-square" style={{fontSize: "14px", marginRight: "6px", color: "rebeccapurple"}}></i>Edit</MyButton>
            </div>

        </div>
    )
}

export default ProfilePage