import React, { useEffect } from 'react'
import style from './style.module.css';

const MySkeletonBlocks = ({ width, height, margin }) => {
    return (
        <div className={style.skeleton} style={{ width: width, height: height, background: "#a5a5a5", marginBottom: margin }}>
        </div>
    )
}

const Skeleton = () => {
    return (
        <div className={`${style.skeletonContainer}`}>
            <div style={{ width: "100%", marginBottom: "20px" }}>
                <MySkeletonBlocks width={'100%'} height={'40px'} />
            </div>
            <hr style={{margin: "20px 0", color: "rebeccapurple"}} />
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <MySkeletonBlocks width={'49%'} height={'140px'} margin={'16px'} />
                <MySkeletonBlocks width={'49%'} height={'140px'} margin={'16px'} />
                <MySkeletonBlocks width={'49%'} height={'140px'} margin={'16px'} />
                <MySkeletonBlocks width={'49%'} height={'140px'} margin={'16px'} />
            </div>
        </div>
    )
}

export default Skeleton