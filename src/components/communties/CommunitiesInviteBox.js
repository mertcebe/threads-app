import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { openCommunitiesInviteFunc, openCommunitiesMenuFunc } from '../../reducers/communitiesReducer/communitiesActions';
import { Box, Button, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import defaultImg from '../../images/threadsLogo.png';
import { setImagesToStorage } from '../../images/imageActions';
import loadingGif from '../../images/loading.gif';
import { TagsInput } from "react-tag-input-component";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const CommunitiesInviteBox = () => {
    let [file, setFile] = useState();
    let [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [role, setRole] = useState('');

    let isOpenCommunitiesInvite = useSelector((state) => {
        return state.communitiesReducer.isOpenCommunitiesInvite;
    });
    const dispatch = useDispatch();


    const handleChange = (event) => {
        setRole(event.target.value);
    };
    return (
        <div style={{ color: "#fff", width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: "0", left: "0", zIndex: "200" }}>
            <div style={{ background: "#fff", padding: "10px", width: "400px", borderRadius: "10px" }}>
                <div style={{ textAlign: "end" }}>
                    <IconButton onClick={() => { openCommunitiesInviteFunc(dispatch, false); }}>
                        <CloseIcon style={{ fontSize: "16px" }} />
                    </IconButton>
                </div>
                <div style={{ color: "#000", pointerEvents: loading ? 'none' : '' }}>
                    <h5 style={{ fontWeight: "bold" }}>Invite members</h5>
                    <div style={{marginTop: "20px"}}>
                        <small className='d-block' style={{ fontSize: "11px", fontWeight: "bold" }}>Email Addresses</small>
                        <small className='d-block text-muted' style={{ fontSize: "10px" }}>
                            Enter or paste one or more email addresses, separated by enter.
                        </small>
                        <Box sx={{margin: "12px 0"}}>
                            <TagsInput
                                value={selected}
                                onChange={setSelected}
                                name="emails"
                                placeHolder="Enter email"
                            />
                        </Box>

                        <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small-label">Role</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={role}
                                label="Role"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'member'}>Member</MenuItem>
                                <MenuItem value={'admin'}>Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div style={{ display: 'flex', justifyContent: "end", alignItems: "center", margin: "10px 0" }}>
                        <Button size="small" style={{ color: "rebeccapurple", fontSize: "10px", marginRight: "10px" }} onClick={() => {
                            openCommunitiesInviteFunc(dispatch, false);
                        }}>Cancel</Button>
                        <Button size="small" variant='contained' style={{ fontSize: "8px", color: "#fff", lineHeight: "16px", background: "rebeccapurple" }}>{loading ? <img src={loadingGif} alt="" style={{ width: "16px", height: "16px" }} /> : 'Send invitations'}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommunitiesInviteBox