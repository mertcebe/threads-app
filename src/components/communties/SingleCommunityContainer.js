import React from 'react'
import defaultBackImg from '../../images/threadsLogo.png';
import { MyViewButton } from '../search/SearchUserContainer';
import { useNavigate } from 'react-router';

const SingleCommunityContainer = ({ community }) => {
    let navigate = useNavigate();
    return (
        <div style={{ width: "49%", background: "#161616", margin: "0.5%", boxSizing: "border-box", padding: "10px", borderRadius: "5px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <img src={community.photoURL ? community.photoURL.src : defaultBackImg} alt="" style={{ width: "50px", height: "50px", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ marginLeft: "10px" }}>
                    <small className='d-block' style={{ fontWeight: "bold", color: "#efefef" }}>{community.communitiesName}</small>
                    <small className='d-block' style={{ color: "grey", fontSize: "10px" }}>@{community.slugURL}</small>
                </div>
            </div>
            <div style={{height: "30px"}}>
                {
                    community.bio &&
                    <div style={{ margin: "10px 0" }}>
                        <small className='d-block' style={{ color: "grey" }}>{community.bio.slice(0, 70)}{community.bio.length >= 70 && '..'}</small>
                    </div>
                }
            </div>
            <MyViewButton onClick={() => {
                navigate(`/communities/${community.id}`)
            }}>View</MyViewButton>
        </div>
    )
}

export default SingleCommunityContainer