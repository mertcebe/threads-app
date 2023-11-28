import styled from '@emotion/styled'
import React from 'react'
import { useNavigate } from 'react-router'
import profileImg from '../../images/twitterProfileImg.png'

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
    let navigate = useNavigate();
    return (
        <div className='d-flex justify-content-between align-items-center w-100' style={{ margin: "10px 0" }}>
            <div className='d-flex justify-content-between align-items-center'>
                <img src={user.photoURL?user.photoURL:profileImg} alt="" style={{ width: "50px", height: "50px", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ marginLeft: "10px" }}>
                    <small className='d-block text-light' style={{ fontWeight: "bold", fontSize: "15px" }}>{user.displayName}</small>
                    <small className='d-block text-secondary' style={{ fontSize: "12px" }}>{user.email}</small>
                </div>
            </div>
            <MyViewButton onClick={() => {
                navigate(`/profile/${user.uid}`)
            }}>View</MyViewButton>
        </div>
    )
}

export default SearchUserContainer