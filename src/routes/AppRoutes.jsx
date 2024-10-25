import { Route, Routes } from "react-router-dom"
import LayoutHome from "../containers/Layout/LayoutHome"
import Home from "../containers/Home"
import WatchDetail from "../containers/WatchDetails"
import Login from "../containers/Authentication/Login"
import Register from "../containers/Authentication/Register"
import PrivateRoleBasedRoute from "./PrivateRoleBasedRoute"
import Dashboard from "../containers/Dashboard"
import BrandMng from "../containers/BrandMng"
import UserMng from "../containers/UserMng"
import UserProfile from "../containers/UserProfile"
import UpdatePassword from "../containers/Authentication/UpdatePassword"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutHome />}>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<WatchDetail />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/updatepassword" element={<UpdatePassword />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoleBasedRoute
              path="/dashboard"
              Component={Dashboard}
            />
          }
        />
        <Route
          path="/brandmng"
          element={
            <PrivateRoleBasedRoute
              path="/brandmng"
              Component={BrandMng}
            />
          }
        />
        <Route
          path="/usermng"
          element={
            <PrivateRoleBasedRoute
              path="/usermng"
              Component={UserMng}
            />
          }
        />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default AppRoutes