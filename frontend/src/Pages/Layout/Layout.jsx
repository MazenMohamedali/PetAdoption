import React from 'react'
import Footer from '../../Component/Footer/Footer' 
import { Outlet } from 'react-router-dom'
import Navbar from '/src/Component/Navbar/Navbar'
import { getStoredUser } from '../../services/api'

export default function Layout({ user }) {
  // Get user from prop or localStorage
  const currentUser = user || getStoredUser();
  
  return <>
  <Navbar user={currentUser}/>
  <Outlet></Outlet>
  <Footer/>
  </>
}
