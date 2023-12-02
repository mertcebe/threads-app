import React from 'react'
import defaultBackImg from '../../../images/threadsLogo.png';
import Moment from 'react-moment';
import { Button } from '@mui/material';

const InvitationContainer = ({ invitation }) => {
    return (
        <div style={{ background: "#161616", padding: "10px", borderRadius: "10px" }}>
            <div className='d-flex justify-content-between align-items-start' style={{ marginBottom: "10px" }}>
                <div className='d-flex align-items-start'>
                    <img src={invitation.community.photoURL ? invitation.community.photoURL : defaultBackImg} alt="" style={{ width: "40px", height: "40px" }} />
                    <div>
                        <small className='d-block' style={{ fontWeight: "bold", color: "#efefef", marginLeft: "10px" }}>{invitation.community.communitiesName}</small>
                        <small className='d-block' style={{ fontSize: "12px", color: "grey", marginLeft: "10px" }}>@{invitation.community.slugURL}</small>
                    </div>
                </div>
                <small style={{ color: "grey" }}>~<Moment fromNow>{invitation.dateSended}</Moment></small>
            </div>
            <small className='d-block' style={{ color: "lightgray" }}>{invitation.message}</small>
            <div>
                <Button size='small' variant='outlined'>Accept</Button>
            </div>
        </div>
    )
}

export default InvitationContainer