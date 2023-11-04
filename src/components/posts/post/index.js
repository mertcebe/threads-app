import React, { useState } from 'react'
import logoColorful from '../../../images/threads-logo-with-different-colors.png';

const Post = ({post}) => {
  let [posts, setPosts] = useState();
  return (
    <div style={{display: "flex", alignItems: "start", background: "#161616", margin: "30px 0", padding: "14px"}}>
      <div>
        <img src={post.owner.photoURL?post.owner.photoURL:logoColorful} alt="" style={{width: "40px", height: "40px", borderRadius: "50%"}} />
      </div>

      <div style={{marginLeft: "10px"}}>
        <p className='m-0 p-0 text-light'><b>{post.owner.displayName}</b></p>
        <small style={{color: "#dfdfdf"}}>{post.text}</small>
      </div>
    </div>
  )
}

export default Post