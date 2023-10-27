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

const AppRouter = () => {
  let { isAuthorized, loading } = useAuthorized();
  if (loading) {
    return (
      <></>
    )
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Private Route */}
          <Route element={<PrivateRoute isAuthorized={isAuthorized} />}>
            <Route path='/' element={<Home />} />
          </Route>

          {/* Public Route */}
          <Route element={<PublicRoute isAuthorized={isAuthorized} />}>
            <Route path='/login' element={<SignInPage />} />
          </Route>
        </Routes>
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