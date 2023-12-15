import styled from '@emotion/styled';
import { IconButton, Menu, MenuItem, Switch, TextareaAutosize, Tooltip, alpha } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import database, { auth } from '../../firebase/firebaseConfig';
import { setImagesToStorage } from '../../images/imageActions';
import { addDoc, collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import loadingGif from '../../images/gifThreads.gif'
import plusImage from '../../images/plusImage.png'
import { getInvolvedCommunities } from '../profile/profileActions';
import { pink } from '@mui/material/colors';
import AssistantIcon from '@mui/icons-material/Assistant';
import BeenhereIcon from '@mui/icons-material/Beenhere';

export const MyButton = styled.button`
  background: #b075e6;
  color: #fff;
  border-radius: 10px;
  width: 100%;
  padding: 8px 0;
  border: none;
  transition: all 0.2s ease;
  &:hover{
    opacity: 0.9;
    border-radius: 0;
  };
  margin-top: 10px;
`;

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

const CreatePage = () => {
  let [text, setText] = useState();
  let [files, setFiles] = useState([]);
  let [loading, setLoading] = useState(false);
  let [communities, setCommunities] = useState();
  let [allCommunitiesName, setAllCommunitiesName] = useState([]);
  const [checked, setChecked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [checkedCommunity, setCheckedCommunity] = useState();

  // toggle switch component
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  // select component
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getInvolvedCommunities(auth.currentUser.uid)
      .then((snapshot) => {
        setCommunities(snapshot);
        let allCommunitiesNames = [];
        snapshot.forEach((community) => {
          allCommunitiesNames.push(community.communitiesName);
        })
        setAllCommunitiesName(allCommunitiesNames);
      })
  }, []);

  const setThreadsForCommunity = (postId, communityId, threadsData) => {
    setDoc(doc(database, `communities/${communityId}/threads/${postId}`), {
      ...threadsData
    })
      .then(() => {
        setDoc(doc(database, `users/${auth.currentUser.uid}/threadsForCommunities/${postId}`), {
          ...threadsData,
          communityId: communityId
        });
      })
  }

  const postFunc = async () => {
    const community = checked ? communities.find((community) => community.communitiesName === checkedCommunity) : null;
    let allMembers = [];
    if (checked) {
      const snapshotForAdmins = await getDocs(query(collection(database, `communities/${community.id}/admins`)))
      const snapshotForMembers = await getDocs(query(collection(database, `communities/${community.id}/members`)))
      snapshotForAdmins.forEach((user) => {
        allMembers.push(user.data().uid);
      })
      snapshotForMembers.forEach((user) => {
        allMembers.push(user.data().uid);
      })
    }
    setLoading(true);
    let user = {
      displayName: auth.currentUser.displayName,
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL
    };
    let post = {
      text: text,
      dateAdded: new Date().getTime()
    };
    if (files.length !== 0) {
      setImagesToStorage(files, auth.currentUser.uid)
        .then((snapshot) => {
          addDoc(collection(database, `users/${auth.currentUser.uid}/newMoves`), { type: 'post' });
          addDoc(collection(database, `users/${auth.currentUser.uid}/posts`), {
            ...post,
            images: snapshot,
            forWhichCommunity: community ? {
              ...community,
              allMembers: allMembers
            } : 'all'
          })
            .then((snapshotForPost) => {
              setDoc(doc(database, `allPosts/${snapshotForPost.id}`), {
                ...post,
                images: snapshot,
                owner: user,
                forWhichCommunity: community ? {
                  ...community,
                  allMembers: allMembers
                } : 'all'
              })
                .then(() => {
                  toast.dark('Posted a thread!');
                  setLoading(false);
                  if (checked) {
                    setThreadsForCommunity(snapshotForPost.id, community.id, { ...post, images: snapshot, owner: user })
                  }
                })
            })
        })
    }
    else {
      addDoc(collection(database, `users/${auth.currentUser.uid}/newMoves`), { type: 'post' });
      addDoc(collection(database, `users/${auth.currentUser.uid}/posts`), {
        ...post,
        forWhichCommunity: community ? {
          ...community,
          allMembers: allMembers
        } : 'all'
      })
        .then((snapshotForPost) => {
          setDoc(doc(database, `allPosts/${snapshotForPost.id}`), {
            ...post,
            owner: user,
            forWhichCommunity: community ? {
              ...community,
              allMembers: allMembers
            } : 'all'
          })
            .then(() => {
              toast.dark('Posted a thread!');
              setLoading(false);
              if (checked) {
                setThreadsForCommunity(snapshotForPost.id, community.id, { ...post, owner: user })
              }
            })
        })
    }
    setText('');
    setFiles([]);
  }

  if (!communities) {
    return (
      <div style={{ width: "calc(100% - 534.28px)", boxSizing: "border-box", padding: "40px 30px" }}>
      </div>
    )
  }
  return (
    <div style={{ width: "calc(100% - 534.28px)", boxSizing: "border-box", padding: "40px 30px" }}>
      {
        loading &&
        <div style={{ position: "absolute", top: "0", left: "0", backdropFilter: "brightness(0.6)", width: "100%", height: "100vh", zIndex: "100" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#fff" }}>
            <img src={loadingGif} alt="" />
          </div>
        </div>
      }
      <h4 style={{ color: "#fff" }}><b>Create Thread</b></h4>
      <p style={{ color: "grey", marginTop: "30px" }}>Content</p>
      <div style={{ position: "relative" }}>
        <textarea value={text} style={{ width: "100%", height: "300px", resize: "none", outline: "none", border: "none", background: "#222", color: "#fff", padding: "10px" }} placeholder='Text something...' onChange={(e) => {
          setText(e.target.value);
        }}></textarea>
        {
          communities.length !== 0 &&
          <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              {
                checkedCommunity ? <Tooltip title={checkedCommunity}><BeenhereIcon sx={{ color: "#613a57", fontSize: "14px" }} /></Tooltip> : <AssistantIcon sx={{ color: "#fff", fontSize: "14px" }} />
              }
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  width: '20ch',
                },
              }}
            >
              <MenuItem key={'none'} onClick={() => {
                setCheckedCommunity();
                setChecked(false);
                handleClose();
              }}>
                None
              </MenuItem>
              {allCommunitiesName.map((option) => (
                <MenuItem key={option} onClick={() => {
                  setCheckedCommunity(option);
                  handleClose();
                }}>
                  {option}
                </MenuItem>
              ))}
            </Menu>
            <Switch
              checked={checked}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
              {...label}
              color="secondary"
              size='small'
              disabled={checkedCommunity ? false : true}
            />
          </div>
        }
      </div>
      <input type="file" id='fileInputForPost' multiple defaultValue={files} style={{ display: "none" }} onChange={(e) => {
        let files = [];
        for (let i = 0; i < e.target.files.length; i++) {
          let url = URL.createObjectURL(e.target.files[i]);
          files.push({
            src: url,
            file: e.target.files[i]
          });
        }
        setFiles(files);
      }} />
      <label htmlFor="fileInputForPost" style={{ color: "grey", cursor: "pointer", fontSize: "14px" }}><i className="fa-regular fa-images"></i> Add</label>
      {
        files &&
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {
            files.map((file) => {
              return (
                <div style={{ position: "relative" }}>
                  <img src={file.src} alt='' style={{ width: "120px", height: "120px", margin: "5px", borderRadius: "5px", filter: "brightness(0.7)" }} />
                  <IconButton style={{ position: "absolute", top: "0", right: "0px" }} onClick={() => {
                    let allFiles = files.filter((item) => item.src !== file.src)
                    setFiles(allFiles);
                  }}>
                    <DoDisturbOnIcon sx={{ fontSize: "20px", color: "#fff" }} />
                  </IconButton>
                </div>
              )
            })
          }
          {
            files.length !== 0 &&
            <div>
              <input type="file" id='addImageFileInput' multiple style={{ display: "none" }} onChange={(e) => {
                let plusFiles = [];
                for (let i = 0; i < e.target.files.length; i++) {
                  let url = URL.createObjectURL(e.target.files[i]);
                  plusFiles.push({
                    src: url,
                    file: e.target.files[i]
                  });
                }
                setFiles([...files, ...plusFiles]);
              }} />
              <button style={{ width: "120px", height: "120px", position: "relative", margin: "5px", cursor: "pointer", border: "none", outline: "none", filter: "brightness(0.6)", background: "#fff", borderRadius: "5px" }} onClick={() => {
                document.getElementById('addImageFileInput').click();
              }}>
                <img src={plusImage} alt='' style={{ width: "100%", height: "100%", pointerEvents: "none" }} />
              </button>
            </div>
          }
        </div>
      }

      <MyButton onClick={postFunc} disabled={text || files.length !== 0 ? false : true} style={{ opacity: text || files.length !== 0 ? '1' : '0.7' }}>Post Thread</MyButton>
    </div>
  )
}

export default CreatePage