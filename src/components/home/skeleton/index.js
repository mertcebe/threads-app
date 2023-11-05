import React, { useEffect } from 'react'
import style from './style.module.css';

const MySkeletonBlocks = ({ width, height }) => {
    return (
        <div className={style.skeleton} style={{ width: width, height: height, background: "#a5a5a5" }}>
        </div>
    )
}

const Skeleton = () => {
    return (
        <div className={`d-flex align-items-start ${style.skeletonContainer}`}>
            <div style={{ marginRight: "10px" }}>
                <MySkeletonBlocks width={'40px'} height={'40px'} />
            </div>
            <div style={{ width: "100%" }}>
                <MySkeletonBlocks width={'140px'} height={'16px'} />
                <MySkeletonBlocks width={'100%'} height={'60px'} />
                <div className='d-flex' style={{width: "110px", justifyContent: "space-between", marginTop: "5px"}}>
                    <MySkeletonBlocks width={'20px'} height={'20px'} />
                    <MySkeletonBlocks width={'20px'} height={'20px'} />
                    <MySkeletonBlocks width={'20px'} height={'20px'} />
                    <MySkeletonBlocks width={'20px'} height={'20px'} />
                </div>
            </div>
        </div>
    )
}

export default Skeleton