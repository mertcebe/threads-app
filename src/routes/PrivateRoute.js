import React from 'react'
import { Navigate, Outlet } from 'react-router'

const PrivateRoute = ({ isAuthorized }) => {
    console.log(isAuthorized)
    return (
        <>
            {
                isAuthorized?
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