import React, { useEffect, useState } from 'react'
import style from './style.module.css'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import database, { auth } from '../../../firebase/firebaseConfig'
import { getInvolvedCommunities } from '../../profile/profileActions'

const RightBar = () => {
  let [communities, setCommunities] = useState();
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
  useEffect(() => {
    getAllCommunities();
  }, []);

  if (!communities) {
    return (
      <div></div>
    )
  }
  return (
    <div className={style.leftBarContainer} style={{ display: "inline-block", padding: "14px 10px", background: "#161616", color: "#fff" }}>
      {/* suggested communities */}
      <div>
        <h5 style={{ fontSize: "16px" }}><b>Suggested Communities</b></h5>
        <div>
          {
            communities.map((community) => {
              return (
                <div>{community.communitiesName}</div>
              )
            })
          }
        </div>
      </div>

      {/* similar minds */}
      <div>
        <h5 style={{ fontSize: "16px" }}><b>Similar Minds</b></h5>
        <div>
          items
        </div>
      </div>
    </div>
  )
}

export default RightBar