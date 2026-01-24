"use client "
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () =>{
    return useContext(AuthContext);
}

export const AuthProvider = ({children})=>{
    const [currUser, setCurrUser] = useState(null);
    useEffect(()=>{
const userId= localStorage.getItem('userId');
if(userId){
    setCurrUser({id: userId});
}
}, []);
}
