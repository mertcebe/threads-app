import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import style from './style.module.css'

const LeftBar = ({type}) => {
  return (
    <div className={style.leftBarContainer} style={{display: "inline-block", padding: "14px 10px", background: "#161616"}}>
        <ul id='leftbarUl' className={style.leftBarUl} style={{listStyle: "none", padding: "0"}}>
            <li><NavLink className={style.navLink} to={'/'}><HomeIcon sx={{marginRight: "5px"}} /><b className='leftBarLiText'>Home</b></NavLink></li>
            <li><NavLink className={style.navLink} to={'/search'}><SearchIcon sx={{marginRight: "5px"}} /><b className='leftBarLiText'>Search</b></NavLink></li>
            <li><NavLink className={style.navLink} to={'/activity'}><FavoriteBorderIcon sx={{marginRight: "5px"}} /><b className='leftBarLiText'>Activity</b></NavLink></li>
            <li><NavLink className={style.navLink} to={'/create'}><AddPhotoAlternateIcon sx={{marginRight: "5px"}} /><b className='leftBarLiText'>Create Thread</b></NavLink></li>
            <li><NavLink className={style.navLink} to={'/communities'}><GroupsIcon sx={{marginRight: "5px"}} /><b className='leftBarLiText'>Communities</b></NavLink></li>
            <li><NavLink className={style.navLink} to={'/profile'}><PersonIcon sx={{marginRight: "5px"}} /><b className='leftBarLiText'>Profile</b></NavLink></li>
        </ul>
    </div>
  )
}

export default LeftBar