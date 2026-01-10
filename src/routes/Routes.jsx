import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import MainLayout from "../layout/MainLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DonationRequest from "../pages/DonationRequest";
import Funding from "../pages/Funding";

import DashboardLayout from "../DashboardLayout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import CreateDonationRequest from "../pages/CreateDonationRequest";
import MyDonationRequest from "../pages/MyDonationRequest";
import MyProfile from "../pages/MyProfile";
import UpdateProfile from "../pages/UpdateProfile";
import PrivateRoute from "./PrivateRoutes";
import AllBloodDonationRequest from "../pages/AllBloodDonationRequest";
import AllUsers from "../pages/AllUsers";
import RequestDetails from "../pages/RequestDetails";
import EditRequest from "../pages/EditRequest";
import SearchDonors from "../pages/SearchDonors";
import About from "../pages/About";
import Contact from "../pages/Contact";

export const router = createBrowserRouter([
  // ==================== Public Routes ====================
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> }, 
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "donation-requests", element: <DonationRequest /> },
      { path: "funding", element: <PrivateRoute><Funding /></PrivateRoute> },
      {
        path:"searchDonors",
        element: <SearchDonors></SearchDonors>
      },
      {
        path: "about",
        element:<About></About>
      },
      {
        path: "contact",
        element: <Contact></Contact>
      }
      
     
      
    ],
  },

 
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true, 
        element: <Dashboard />,
      },
      {
        path: "createRequest", 
        element: <CreateDonationRequest />,
      },
      { path: "all-users", element: <AllUsers></AllUsers> },
      {
        path: "my-donation-requests", 
        element: <MyDonationRequest></MyDonationRequest>,
      },
      
      {
        path: "profile", 
        element: <MyProfile />,
      },
      {
        path: "request-details/:id",
        element: <RequestDetails></RequestDetails>,
      },
      {
        path: "updateProfile", 
        element: <UpdateProfile />,
      },
      {
  path: "edit-request/:id",
  element: <EditRequest></EditRequest>,
},
      {
        path: "all-blood-donation-request",
        element: <AllBloodDonationRequest></AllBloodDonationRequest>,
      },
      
    ],
  },
]);
