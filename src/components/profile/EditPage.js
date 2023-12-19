import React, { useEffect, useState } from 'react'
import { getUser } from './profileActions';
import defaultProfileImg from '../../images/twitterProfileImg.png'
import database, { auth } from '../../firebase/firebaseConfig';
import styled from '@emotion/styled';
import { MyButton } from '../create';
import { updateProfile } from 'firebase/auth';
import { Icon, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { setImagesToStorage } from '../../images/imageActions';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import loadingGif from '../../images/gifThreads.gif'
import { useNavigate } from 'react-router';

export const MyInput = styled.input`
    border: none;
    background: #161616;
    color: #dfdfdf;
    font-weight: bold;
    outline: none;
    width: 100%;
    padding: 5px;
    margin: 5px 0;
`;

const MyTextArea = styled.textarea`
    border: none;
    background: #161616;
    color: #dfdfdf;
    font-weight: bold;
    outline: none;
    width: 100%;
    height: 200px;
    padding: 5px;
    margin: 5px 0;
    resize: none;
`

const EditPage = () => {
    let [profile, setProfile] = useState();
    let [profileImg, setProfileImg] = useState();
    let [name, setName] = useState('');
    let [bio, setBio] = useState('');
    let [loading, setLoading] = useState(false);
    useEffect(() => {
        getUser(auth.currentUser.uid)
            .then((snapshot) => {
                setProfile(snapshot);
                setName(snapshot.displayName);
                setBio(snapshot.description);
            })
    }, []);

    const navigate = useNavigate();

    const editFunc = (e) => {
        e.preventDefault();
        setLoading(true);
        if (profileImg) {
            setImagesToStorage([profileImg], auth.currentUser.uid)
                .then((snapshot) => {
                    updateDoc(doc(database, `users/${auth.currentUser.uid}`), {
                        displayName: name,
                        description: bio,
                        photoURL: snapshot[0].src
                    });
                    updateProfile(auth.currentUser, {
                        displayName: name,
                        photoURL: snapshot[0].src
                    })
                        .then(() => {
                            toast.dark('Editted profile');
                            setLoading(false);
                            navigate('/profile')
                        })
                })
        }
        else {
            updateDoc(doc(database, `users/${auth.currentUser.uid}`), {
                displayName: name,
                description: bio,
            });
            updateProfile(auth.currentUser, {
                displayName: name
            })
                .then(() => {
                    toast.dark('Editted profile');
                    setLoading(false);
                    navigate('/profile')
                })
        }
    }

    if (!profile) {
        return (
            <div className='responsiveContanier' style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
                loading...
            </div>
        )
    }
    return (
        <div className='responsiveContanier' style={{ width: "calc(100% - 534.28px)", padding: "40px 30px" }}>
            <h4 style={{ color: "#fff" }}><b>Edit Profile</b></h4>
            <small className='text-secondary' style={{ fontSize: "12px" }}><b>Make any changes</b></small>
            {
                loading &&
                <div style={{ position: "absolute", top: "0", left: "0", backdropFilter: "brightness(0.6)", width: "100%", height: "100vh", zIndex: "100" }}>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#fff" }}>
                        <img src={loadingGif} alt="" />
                    </div>
                </div>
            }
            <div className='my-3' style={{ display: "flex", alignItems: "center" }}>
                <img src={profileImg ? profileImg.url : profile?.photoURL ? profile.photoURL : defaultProfileImg} alt="" style={{ width: "54px", height: "54px", borderRadius: "50%", marginRight: "5px" }} />
                <input type="file" id='profileImgInput1' style={{ display: "none" }} onChange={(e) => {
                    const url = URL.createObjectURL(e.target.files[0]);
                    setProfileImg({
                        file: e.target.files[0],
                        url: url
                    });
                }} />
                <IconButton onClick={() => {
                    document.getElementById('profileImgInput1').click();
                }}>
                    <AddPhotoAlternateIcon style={{ color: "#fff" }} />
                </IconButton>
                <small className='text-secondary'>Add profile photo</small>
                {
                    profileImg &&
                    <IconButton onClick={() => {
                        document.getElementById('profileImgInput1').value = null;
                        setProfileImg();
                    }}>
                        <CloseIcon style={{ color: "#fff" }} />
                    </IconButton>
                }
            </div>

            <form onSubmit={editFunc}>
                <small className='d-block text-secondary' style={{ fontWeight: "bold" }}>Name</small>
                <MyInput type='text' defaultValue={profile.displayName} onChange={(e) => { setName(e.target.value); }} />

                <small className='d-block text-secondary' style={{ fontWeight: "bold", marginTop: "30px" }}>Bio</small>
                <MyTextArea defaultValue={profile.description} onChange={(e) => { setBio(e.target.value); }} />
                <MyButton disabled={name !== profile.displayName || bio !== profile.description || profileImg ? false : true} style={{ opacity: name !== profile.displayName || bio !== profile.description || profileImg ? '1' : '0.7' }}>Edit Profile</MyButton>
            </form>
        </div>
    )
}

export default EditPage