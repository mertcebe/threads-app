import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router'
import CommunitiesCreateBox from '../components/communties/CommunitiesCreateBox';
import CommunitiesInviteBox from '../components/communties/CommunitiesInviteBox';

const PrivateRoute = ({ isAuthorized }) => {
    console.log(isAuthorized)
    let [isOpenCommunitiesMenu, isOpenCommunitiesInvite] = useSelector((state) => {
        return [state.communitiesReducer.isOpenCommunitiesMenu, state.communitiesReducer.isOpenCommunitiesInvite];
    });
    return (
        <>
            {
                isOpenCommunitiesMenu &&
                <CommunitiesCreateBox />
            }
            {
                isOpenCommunitiesInvite &&
                <CommunitiesInviteBox />
            }
            {
                isAuthorized ?
                    <>
                        <Outlet />
                    </>
                    :
                    <>
                        <Navigate to={'/login'} />
                    </>
            }
        </>
    )
}

export default PrivateRoute