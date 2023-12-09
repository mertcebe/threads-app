import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import profileImg from '../../images/twitterProfileImg.png'
import { IconButton, Tooltip } from '@mui/material'
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import database, { auth } from '../../firebase/firebaseConfig'
import { toast } from 'react-toastify'

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
    let [admins, setAdmins] = useState([]);
    let [loading, setLoading] = useState(false);
    let navigate = useNavigate();
    let location = useLocation();
    const { id } = useParams();

    const updateRole = (role) => {
        updateDoc(doc(database, `communities/${id}/members/${user.uid}`), {
            role: role
        })
            .then(() => {
                // if (role === 'admin') {
                //     setDoc(doc(database, `communities/${id}/admins/${user.uid}`), {
                //         ...user,
                //         role: 'admin'
                //     })
                //     deleteDoc(doc(database, `communities/${id}/members/${user.uid}`))
                // }
                // else if(role === 'member'){
                //     setDoc(doc(database, `communities/${id}/members/${user.uid}`), {
                //         ...user,
                //         role: 'member'
                //     })
                //     deleteDoc(doc(database, `communities/${id}/admins/${user.uid}`))
                // }
                setRole(role);
            })
    }

    useEffect(() => {
        getDocs(collection(database, `communities/${id}/admins`))
            .then((snapshot) => {
                let admins = [];
                snapshot.forEach((user) => {
                    admins.push(user.data().uid);
                })
                setAdmins(admins)
            })
    }, []);

    const func = () => {
        getDoc(doc(database, `communities/${id}/admins/${user.uid}`))
        .then((snapshot) => {
            setDoc(doc(database, `communities/${id}/members/${user.uid}`), snapshot.data());
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
                    location.pathname.includes('communities') &&
                    <Tooltip title={role === 'member' ? 'Member' : 'Admin'}>
                        <div style={{ color: "lightgray", background: "#000", display: "inline-block", padding: "2px 8px", borderRadius: "8px", margin: "0 10px", cursor: "default" }}>
                            {
                                role === 'member' ?
                                    <IconButton onClick={() => {
                                        if (admins.includes(auth.currentUser.uid) && auth.currentUser.uid !== user.uid) {
                                            setLoading(true);
                                            setTimeout(() => { setLoading(false) }, 2000);
                                            updateRole('admin');
                                        }
                                    }} disabled={loading}>
                                        <i className="fa-solid fa-user-large text-light" style={{ fontSize: "14px", opacity: loading ? '0.5' : '1' }}></i>
                                    </IconButton>
                                    :
                                    <IconButton onClick={() => {
                                        if (admins.includes(auth.currentUser.uid) && auth.currentUser.uid !== user.uid) {
                                            setLoading(true);
                                            setTimeout(() => { setLoading(false) }, 2000);
                                            updateRole('member');
                                        }
                                    }} disabled={loading}>
                                        <i className="fa-solid fa-user-gear text-light" style={{ fontSize: "14px", opacity: loading ? '0.5' : '1' }}></i>
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