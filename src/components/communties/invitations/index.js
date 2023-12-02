import React from 'react'
import defaultBackImg from '../../../images/threadsLogo.png';
import Moment from 'react-moment';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { NavLink } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import database, { auth } from '../../../firebase/firebaseConfig';

const InvitationContainer = ({ invitation }) => {

    const deleteInvitationFunc = () => {
        deleteDoc(doc(database, `users/${auth.currentUser.uid}/communitiesInvite/${invitation.id}`))
        .then(() => {
            document.getElementById(`invitationContainer-${invitation.id}`).style.opacity = '0.4';
        })
    }
    return (
        <div style={{ background: "#161616", padding: "10px", borderRadius: "10px" }} id={`invitationContainer-${invitation.id}`}>
            <div className='d-flex justify-content-between align-items-start' style={{ marginBottom: "10px" }}>
                <div className='d-flex align-items-start'>
                    <img src={invitation.community.photoURL ? invitation.community.photoURL.src : defaultBackImg} alt="" style={{ width: "40px", height: "40px" }} />
                    <div>
                        <small className='d-block' style={{ fontWeight: "bold", color: "#efefef", marginLeft: "10px" }}>{invitation.community.communitiesName}</small>
                        <small className='d-block' style={{ fontSize: "12px", color: "grey", marginLeft: "10px" }}>@{invitation.community.slugURL}</small>
                    </div>
                </div>
                <small style={{ color: "grey" }}>~<Moment fromNow>{invitation.dateSended}</Moment></small>
            </div>
            <small className='d-block' style={{ color: "lightgray" }}>{invitation.message}</small>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    {
                        invitation.sendedUser && <span style={{color: "grey", fontSize: "12px"}}>Sended by <NavLink to={`/profile/${invitation.sendedUser?.uid}`} style={{color: "darkblue", textDecoration: "none"}}>{invitation.sendUser?.email}qwd</NavLink></span>
                    }
                </div>
                <div>
                    <IconButton sx={{ mr: "5px" }} onClick={deleteInvitationFunc}>
                        <DeleteIcon sx={{ color: "red", fontSize: "18px" }} />
                    </IconButton>
                    <Button size='small' variant='outlined' color='info' style={{ fontSize: "10px" }}>Accept invitation</Button>
                </div>
            </div>
        </div>
    )
}

export default InvitationContainer