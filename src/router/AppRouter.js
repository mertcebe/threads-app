import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../components/home'
import PrivateRoute from '../routes/PrivateRoute'
import PublicRoute from '../routes/PublicRoute'
import useAuthorized from '../useAuth/useAuthorized'
import SignInPage from '../components/signIn'
import '../style.scss';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import LeftBar from '../components/navbars/leftbar'
import TopBar from '../components/navbars/topbar'
import RightBar from '../components/navbars/rightbar'
import CreatePage from '../components/create'

const AppRouter = () => {
  let { isAuthorized, loading } = useAuthorized();
  if (loading) {
    return (
      <></>
    )
  }
  return (
    <div style={{ background: isAuthorized ? "#000" : "" }}>
      <BrowserRouter>
        {
          isAuthorized &&
          <TopBar />
        }
        <div style={{ display: "flex", alignItems: "start" }}>
          {
            isAuthorized &&
            <LeftBar />
          }
          <Routes>
            {/* Private Route */}
            <Route element={<PrivateRoute isAuthorized={isAuthorized} />}>
              <Route path='/' element={<Home />} />
              <Route path='/create' element={<CreatePage />} />
            </Route>

            {/* Public Route */}
            <Route element={<PublicRoute isAuthorized={isAuthorized} />}>
              <Route path='/login' element={<SignInPage />} />
            </Route>
          </Routes>
          {
            isAuthorized &&
            <RightBar />
          }
        </div>
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </div>
  )
}

export default AppRouter