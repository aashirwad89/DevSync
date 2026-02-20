/* eslint-disable no-undef */
import React from 'react';
import {useNavigate, useRoutes} from 'react-router-dom'

// page import list 
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/user/Profile';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Issues from './components/issues/Issues';
import Repo from './components/repo/Repo';

// AuthContext 
import {useAuth} from "./authContext";

const ProjectRoutes = ()=>{
const {currUser, setcurrUser} = useAuth;
const navigate = useNavigate();

useEffect(()=>{
    const userIdFromStorage = localStorage.getItem("userId");
    if(userIdFromStorage && !currUser){
setcurrUser(userIdFromStorage);
    }

    if(!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)){
navigate("/auth")
    }

    if(userIdFromStorage && window.location.pathname == "/auth"){
        navigate("/")
    }
}, [currUser, navigate, setcurrUser])


let elements = useRoutes([
    {
        path: '/',
        element:<Dashboard/>
    },
    {
        path: '/auth',
        element:<Login/>
    },
    {
        path: '/signup',
        element:<SignUp/>
    },
    {
        path: '/profile',
        element:<Profile/>
    },
    {
        path: '/issue',
        element:<Issues/>
    },
    {
        path: '/repo',
        element:<Repo/>
    }
]);

return elements;
}

export default ProjectRoutes;
