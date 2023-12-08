import styled from '@emotion/styled'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import profileImg from '../../images/twitterProfileImg.png'
import { IconButton, Tooltip } from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore'
import database from '../../firebase/firebaseConfig'

export const MyViewButton = styled.button`
    border: none;
    background: #ac7cd9;
    color: #efefef;
    padding: 5px 20px;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.1s ease;

    &:hover{
        opacity: 0.7;
    }
`

const SearchUserContainer = ({ user }) => {
    let [role, setRole] = useState(user.role);
    let [loading, setLoading] = useState(false);
    let navigate = useNavigate();
    const { id } = useParams();

    const updateRole = (role) => {
        console.log(`communities/${id}/members/${user.uid}`)
        updateDoc(doc(database, `communities/${id}/members/${user.uid}`), {
            role: role
        })
            .then(() => {
                setRole(role);
            })
    }

    return (
        <div className='d-flex justify-content-between align-items-center w-100' style={{ margin: "10px 0" }}>
            <div className='d-flex justify-content-between align-items-center'>
                <img src={user.photoURL ? user.photoURL : profileImg} alt="" style={{ width: "50px", height: "50px", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ marginLeft: "10px" }}>
                    <small className='d-block text-light' style={{ fontWeight: "bold", fontSize: "15px" }}>{user.displayName}</small>
                    <small className='d-block text-secondary' style={{ fontSize: "12px" }}>{user.email}</small>
                </div>
            </div>
            <div>
                {
                    user.role === 'admin' &&
                    <Tooltip title={role === 'member' ? 'Member' : 'Admin'}>
                        <div style={{ color: "lightgray", background: "#000", display: "inline-block", padding: "2px 8px", borderRadius: "8px", margin: "0 10px", cursor: "default" }}>
                            {
                                role === 'member' ?
                                    <IconButton onClick={() => {
                                        setLoading(true);
                                        setTimeout(() => {setLoading(false)}, 2000);
                                        updateRole('admin');
                                    }} disabled={loading}>
                                        <i className="fa-solid fa-user-large text-light" style={{ fontSize: "14px", opacity: loading?'0.5':'1' }}></i>
                                    </IconButton>
                                    :
                                    <IconButton onClick={() => {
                                        setLoading(true);
                                        setTimeout(() => {setLoading(false)}, 2000);
                                        updateRole('member');
                                    }} disabled={loading}>
                                        <i className="fa-solid fa-user-gear text-light" style={{ fontSize: "14px", opacity: loading?'0.5':'1' }}></i>
                                    </IconButton>
                            }
                        </div>
                    </Tooltip>
                }
                <MyViewButton onClick={() => {
                    navigate(`/profile/${user.uid}`)
                }}>View</MyViewButton>
            </div>
        </div>
    )
}

export default SearchUserContainer