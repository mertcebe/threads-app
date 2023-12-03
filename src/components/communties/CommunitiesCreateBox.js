import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { openCommunitiesInviteFunc, openCommunitiesMenuFunc } from '../../reducers/communitiesReducer/communitiesActions';
import { Button, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import defaultImg from '../../images/threadsLogo.png';
import { setImagesToStorage } from '../../images/imageActions';
import loadingGif from '../../images/loading.gif';
import { auth } from '../../firebase/firebaseConfig';
import { setCommunitiesToFirebase } from './CommunitiesActions';
import { startCommentInCommentFunc } from '../../reducers/commentReducer/CommentsActions';

const CommunitiesCreateBox = () => {
    let [file, setFile] = useState();
    let [communitiesText, setCommunitiesText] = useState('');
    let [loading, setLoading] = useState(false);
    let [slugURLText, setSlugURLText] = useState('');
    let isOpenCommunitiesMenu = useSelector((state) => {
        return state.communitiesReducer.isOpenCommunitiesMenu;
    });
    const dispatch = useDispatch();

    const createFunc = async () => {
        const user = {
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            uid: auth.currentUser.uid,
            photoURL: auth.currentUser.photoURL
        };
        let communities = {};
        setLoading(true);
        if (file) {
            await setImagesToStorage([file], auth.currentUser.uid)
                .then((snapshot) => {
                    communities = {
                        communitiesName: communitiesText,
                        slugURL: slugURLText,
                        dateCreation: new Date().getTime(),
                        photoURL: snapshot[0],
                        admin: user
                    }
                })
        }
        else {
            communities = {
                communitiesName: communitiesText,
                slugURL: slugURLText,
                dateCreation: new Date().getTime(),
                photoURL: null,
                admin: user
            }
        }
        await setCommunitiesToFirebase(communities)
            .then((snapshot) => {
                setLoading(false);
                setFile();
                openCommunitiesMenuFunc(dispatch, false);
                openCommunitiesInviteFunc(dispatch, snapshot, true);
            })
    }

    return (
        <div style={{ color: "#fff", width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: "0", left: "0", zIndex: "200", backdropFilter: "brightness(0.4)" }}>
            <div style={{ background: "#fff", padding: "10px", width: "400px", borderRadius: "10px" }}>
                <div style={{ textAlign: "end" }}>
                    <IconButton onClick={() => { openCommunitiesMenuFunc(dispatch, false); }}>
                        <CloseIcon style={{ fontSize: "16px" }} />
                    </IconButton>
                </div>
                <div style={{ color: "#000", pointerEvents: loading ? 'none' : '' }}>
                    <h5 style={{ fontWeight: "bold" }}>Create Organization</h5>
                    <div style={{ display: "flex", alignItems: "center", margin: "20px 0 10px 0" }}>
                        <img src={file ? file.url : defaultImg} alt="" style={{ width: "40px", height: "40px", borderRadius: "5px", marginRight: "10px" }} />
                        <div>
                            <small className='d-block m-0 p-0' style={{ fontSize: "12px", fontWeight: "bold" }}>Profile image</small>
                            <input type="file" id='fileInputForCommunities' style={{ display: "none" }} onChange={(e) => {
                                const url = URL.createObjectURL(e.target.files[0]);
                                setFile({
                                    file: e.target.files[0],
                                    url: url
                                });
                            }} />
                            <div>
                                <label htmlFor="fileInputForCommunities" className='m-0' style={{ fontSize: "12px", cursor: "pointer", color: "darkblue" }}>Upload image</label>
                                <button style={{ border: "none", outline: "none", background: "transparent", color: "darkred", fontSize: "12px", marginRight: "10px" }} onClick={() => {
                                    setFile();
                                    document.getElementById('fileInputForCommunities').value = '';
                                }}>Remove image</button>
                            </div>
                        </div>
                    </div>
                    <small className='text-muted d-block' style={{ fontSize: "10px" }}>Organization name</small>
                    <TextField
                        fullWidth
                        id="outlined-size-small"
                        size="small"
                        onChange={(e) => {
                            setCommunitiesText(e.target.value);
                            let text = '';
                            e.target.value.split('').forEach((word) => {
                                if (word === ' ') {
                                    text += '-'
                                }
                                else if (word === word.toUpperCase()) {
                                    text += word.toLowerCase();
                                }
                                else {
                                    text += word;
                                }
                            });
                            setSlugURLText(text)
                        }}
                    />
                    <small className='text-muted d-block mt-2' style={{ fontSize: "10px" }}>Slug URL</small>
                    <TextField
                        disabled
                        fullWidth
                        id="outlined-size-small"
                        size="small"
                        value={slugURLText}
                    />

                    <div style={{ display: 'flex', justifyContent: "end", alignItems: "center", margin: "10px 0" }}>
                        <Button size="small" style={{ color: "rebeccapurple", fontSize: "10px", marginRight: "10px" }} onClick={() => {
                            openCommunitiesMenuFunc(dispatch, false);
                        }}>Cancel</Button>
                        <Button size="small" variant='contained' disabled={file || communitiesText ? false : true} style={{ fontSize: "8px", opacity: file || communitiesText ? '1' : '0.7', color: "#fff", lineHeight: "16px", background: "rebeccapurple" }} onClick={createFunc}>{loading ? <img src={loadingGif} alt="" style={{ width: "16px", height: "16px" }} /> : 'Create Organization'}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommunitiesCreateBox