import React from 'react'
import './Navbar.css'

const HomeNavbar = ({setComponent}) => {
    const changeComponentlogin = ()=>{
        setComponent("Login")
    }
    const changeComponentreg = ()=>{
        setComponent("Register")
    }
  return (
<nav className="navbar navbar-dark bg-dark">
  <div className="container-fluid">
    <a className="navbar-brand"><img src="\Snipaste_2024-01-16_13-07-18-removebg-preview.png" alt="Brand" width={128}/></a>
    <div className="d-flex">
      <button className="btn btn-outline-success log-btn me-3" type="submit" onClick={changeComponentlogin}>Login</button>
      <button className="btn btn-outline-success reg-btn" type="submit" onClick={changeComponentreg}>Register</button>
    </div>
  </div>
</nav>
  )
}

export default HomeNavbar
