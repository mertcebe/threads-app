import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useLocation, useNavigate, useParams } from 'react-router'
import profileImg from '../../images/twitterProfileImg.png'
import { IconButton, Tooltip } from '@mui/material'
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import database, { auth } from '../../firebase/firebaseConfig'

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

const SuggestedCommunity = ({ community }) => {
    let navigate = useNavigate();
    let location = useLocation();
    const { id } = useParams();

    return (
        <div className='d-flex justify-content-between align-items-center w-100' style={{ margin: "10px 0" }}>
            <div className='d-flex justify-content-between align-items-center'>
                <img src={community.photoURL ? community.photoURL.src : profileImg} alt="" style={{ width: "50px", height: "50px", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ marginLeft: "10px" }}>
                    <small className='d-block text-light' style={{ fontWeight: "bold", fontSize: "15px" }}>{community.communitiesName}</small>
                    <small className='d-block text-secondary' style={{ fontSize: "12px" }}>{community.slugURL}</small>
                </div>
            </div>
            <div>
                <MyViewButton onClick={() => {
                    navigate(`/communities/${community.id}`)
                }}>View</MyViewButton>
            </div>
        </div>
    )
}

export default SuggestedCommunity