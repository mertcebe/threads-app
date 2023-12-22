import React, { useEffect, useState } from 'react'
import style from './style.module.css'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import database, { auth } from '../../../firebase/firebaseConfig'
import { getInvolvedCommunities } from '../../profile/profileActions'
import SuggestedCommunity from '../../communties/SuggestedCommunity'
import SearchUserContainer from '../../search/SearchUserContainer'
import { useNavigate } from 'react-router'

const RightBar = () => {
  let [communities, setCommunities] = useState();
  let [users, setUsers] = useState();
  const navigate = useNavigate();
  const getAllCommunities = () => {
    getDocs(query(collection(database, `communities`), limit(3)))
      .then(async (snapshot) => {
        let allCommunities = [];
        let allInvolvedCommunitiesIds = [];
        await getInvolvedCommunities(auth.currentUser.uid)
          .then((snapshotForInvolvedCommunities) => {
            snapshotForInvolvedCommunities.forEach((item) => {
              allInvolvedCommunitiesIds.push(item.id);
            })
            snapshot.forEach((item) => {
              if (!allInvolvedCommunitiesIds.includes(item.id)) {
                allCommunities.push({
                  ...item.data(),
                  id: item.id
                });
              }
            })
            setCommunities(allCommunities);
          })
      })
  }
  const getSimilarMinds = () => {
    getDocs(query(collection(database, `users`), limit(4)))
      .then(async (snapshot) => {
        let users = [];
        snapshot.forEach((user) => {
          users.push(user.data());
        })
        setUsers(users);
      })
  }
  useEffect(() => {
    getAllCommunities();
    getSimilarMinds();
  }, []);

  if (!communities || !users) {
    return (
      <div className={style.rightBarContainer} style={{ display: "inline-block", padding: "14px 10px", background: "#161616", color: "#fff" }}>
        loading..
      </div>
    )
  }
  return (
    <div className={style.rightBarContainer} style={{ display: "inline-block", padding: "14px 10px", background: "#161616", color: "#fff" }}>
      {/* suggested communities */}
      <div>
        <h5 style={{ fontSize: "16px", marginBottom: "20px" }}><b>Suggested Communities</b></h5>
        <div>
          {
            communities.map((community) => {
              return (
                <SuggestedCommunity community={community} />
              )
            })
          }
        </div>
      </div>

      {/* similar minds */}
      <div style={{marginTop: "50px"}}>
        <h5 style={{ fontSize: "16px", marginBottom: "20px" }}><b>Similar Minds</b></h5>
        <div>
          {
            users.map((user) => {
              return (
                <SearchUserContainer user={user} type={'search'} />
              )
            })
          }
          <button style={{background: "transparent", color: "#dfdfdf", border: "none", fontSize: "12px"}} onClick={() => {navigate(`/search`)}}>Show more</button>
        </div>
      </div>
    </div>
  )
}

export default RightBar