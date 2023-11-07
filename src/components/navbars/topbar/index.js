import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoColorful from '../../../images/threads-logo-with-different-colors.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import database, { auth } from '../../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const TopBar = ({ type }) => {
    let [user, setUser] = useState();
    useEffect(() => {
        getDoc(doc(database, `users/${auth.currentUser.uid}`))
            .then((snapshot) => {
                setUser(snapshot.data());
            })
    })
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161616", height: "50px", position: "sticky", top: "0", padding: "0 30px", zIndex: 100 }}>
            <NavLink to={'/'} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#e3e3e3" }}>
                <img src={logoColorful} alt="" style={{ width: "25px", height: "25px", marginRight: "8px", pointerEvents: "none" }} />
                <h5 className='m-0 p-0'>Threads</h5>
            </NavLink>
            <NavLink to={'/profile'} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#e3e3e3" }}><AccountCircleIcon sx={{ marginRight: "5px" }} />{user?user.displayName:'user'}</NavLink>
        </div>
    )
}

export default TopBar