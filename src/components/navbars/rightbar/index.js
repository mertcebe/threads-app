import React from 'react'
import style from './style.module.css'

const RightBar = () => {
  return (
    <div className={style.leftBarContainer} style={{ display: "inline-block", padding: "14px 10px", background: "#161616", color: "#fff" }}>
      {/* suggested communities */}
      <div>
        <h5 style={{fontSize: "16px"}}><b>Suggested Communities</b></h5>
        <div>
          items
        </div>
      </div>

      {/* similar minds */}
      <div>
        <h5 style={{fontSize: "16px"}}><b>Similar Minds</b></h5>
        <div>
          items
        </div>
      </div>
    </div>
  )
}

export default RightBar