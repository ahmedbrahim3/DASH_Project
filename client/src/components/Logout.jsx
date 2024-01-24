import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate();
    const logout = async () =>{
        try {
            await axios.post('http://localhost:8000/api/users/logout',{}, {withCredentials:true})
            localStorage.removeItem('token')
            navigate('/')
        } catch (error) {
            console.log('Error', error)
        }
    }
  return (
    <i className="btn reg-btn bi bi-box-arrow-right" onClick={logout}></i>
  )
}

export default Logout