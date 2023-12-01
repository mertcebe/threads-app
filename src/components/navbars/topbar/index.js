import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logoColorful from '../../../images/threads-logo-with-different-colors.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import database, { auth } from '../../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Button, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { openCommunitiesMenuFunc } from '../../../reducers/communitiesReducer/communitiesActions';

const TopBar = ({ type }) => {
    let [user, setUser] = useState();
    useEffect(() => {
        getDoc(doc(database, `users/${auth.currentUser.uid}`))
            .then((snapshot) => {
                setUser(snapshot.data());
            })
    })

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    let isOpenCommunitiesMenu = useSelector((state) => {
        return state.communitiesReducer.isOpenCommunitiesMenu;
    });
    const dispatch = useDispatch();
    const openCommunitiesMenu = () => {
        openCommunitiesMenuFunc(dispatch, true);
        handleClose();
    }

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161616", height: "50px", position: "sticky", top: "0", padding: "0 30px", zIndex: 100 }}>
            <NavLink to={'/'} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#e3e3e3" }}>
                <img src={logoColorful} alt="" style={{ width: "25px", height: "25px", marginRight: "8px", pointerEvents: "none" }} />
                <h5 className='m-0 p-0'>Threads</h5>
            </NavLink>
            <button
                style={{background: "transparent", border: "none", outline: "none", color: "#efefef", fontSize: "14px", display: "flex", alignItems: "center"}}
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <AccountCircleIcon sx={{ marginRight: "5px" }} />
                <span>Personal Workspace</span>
            </button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{style:{background: "#000"}}}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem style={{color: "#fff"}} onClick={() => {
                    navigate(`/profile`);
                    handleClose();
                }}><AccountCircleIcon sx={{ marginRight: "5px"}} />Profile</MenuItem>
                <MenuItem style={{color: "#fff"}} onClick={openCommunitiesMenu}><AddIcon sx={{ marginRight: "5px", fontSize: "14px" }} />Create organization</MenuItem>
            </Menu>
        </div>
    )
}

export default TopBar