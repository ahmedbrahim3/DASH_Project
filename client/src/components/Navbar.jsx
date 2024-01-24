import { Link } from "react-router-dom"
import Logout from "./Logout"
import { useState } from "react";

const Navbar = () => {
  const [notifications,setNotifications]=useState("");
  function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;}
  const currUser = getCookie('userId')
  return (
<nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
  <div className="container-fluid">
    <a className="navbar-brand"><img src="\Snipaste_2024-01-16_13-07-18-removebg-preview.png" alt="Brand" width={128}/></a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
      <div className="navbar-nav me-5">
        <a className="nav-link active" aria-current="page" href="/posts"><i className="bi bi-house nav-icon"></i></a>
        <a className="nav-link" href="/messenger"><i className="bi bi-chat-dots msg-icon"></i></a>
        <Link className="nav-link" to={`/profile/${currUser}`}><i className="bi bi-person-circle nav-icon"></i></Link>
      </div>
    <Logout/>
  </div>
</nav>
  )
}

export default Navbar