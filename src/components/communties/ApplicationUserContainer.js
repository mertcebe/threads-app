import styled from '@emotion/styled'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import profileImg from '../../images/twitterProfileImg.png'
import { IconButton, Tooltip } from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore'
import database from '../../firebase/firebaseConfig'
import { MyViewButton } from '../search/SearchUserContainer'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { acceptApplicationFunc, deleteApplicationFunc } from './CommunitiesActions'

const ApplicationUserContainer = ({ user }) => {
    let [role, setRole] = useState(user.role);
    let [loading, setLoading] = useState(false);
    let navigate = useNavigate();
    const { id } = useParams();

    const deleteDocumentFunc = (id) => {
        document.getElementById(id).style.opacity = 0.4;
    }

    return (
        <div className='d-flex justify-content-between align-items-center w-100' id={user.uid} style={{ margin: "10px 0" }}>
            <div className='d-flex justify-content-between align-items-center'>
                <img src={user.sendedUser.photoURL ? user.sendedUser.photoURL : profileImg} alt="" style={{ width: "50px", height: "50px", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ marginLeft: "10px" }}>
                    <Tooltip title={user.message}><small className='d-block text-light' style={{ fontWeight: "bold", fontSize: "15px", cursor: "default" }}>{user.sendedUser.displayName}</small></Tooltip>
                    <small className='d-block text-secondary' style={{ fontSize: "12px" }}>{user.sendedUser.email}</small>
                </div>
            </div>
            <div>
                <Tooltip title={role === 'member' ? 'Member' : 'Admin'}>
                    <div style={{ color: "lightgray", background: "#000", display: "inline-block", padding: "2px 8px", borderRadius: "8px", margin: "0 10px", cursor: "default" }}>
                        {
                            role === 'member' ?
                                <i className="fa-solid fa-user-large text-light" style={{ fontSize: "14px", opacity: loading ? '0.5' : '1' }}></i>
                                :
                                <i className="fa-solid fa-user-gear text-light" style={{ fontSize: "14px", opacity: loading ? '0.5' : '1' }}></i>
                        }
                    </div>
                </Tooltip>
                <Tooltip title={'Go to profile'}>
                    <IconButton style={{ marginRight: "10px" }} onClick={() => {
                        navigate(`/profile/${user.sendedUser.uid}`)
                    }}>
                        <CallMissedOutgoingIcon sx={{ color: "lightblue", fontSize: "20px" }} />
                    </IconButton>
                </Tooltip>
                <IconButton style={{ marginRight: "10px" }} onClick={() => {
                    acceptApplicationFunc(id, user.sendedUser.uid)
                        .then(() => {
                            deleteDocumentFunc(user.sendedUser.uid);
                        })
                }}>
                    <DoneOutlineIcon sx={{ color: "lightgreen", fontSize: "20px" }} />
                </IconButton>
                <IconButton onClick={() => {
                    deleteApplicationFunc(id, user.sendedUser.uid)
                        .then(() => {
                            deleteDocumentFunc(user.sendedUser.uid);
                        })
                }}>
                    <DeleteIcon sx={{ color: "red", fontSize: "20px" }} />
                </IconButton>
            </div>
        </div>
    )
}

export default ApplicationUserContainer