import React, { useState } from 'react'
import Register from '../components/Register'
import Login from '../components/Login'
import HomeNavbar from '../components/HomeNavbar'
import './LogReg.css'
const LogReg = (props) => {
    const [component,setComponent]=useState('Login');
    return (
        <div>
            <HomeNavbar setComponent={setComponent}/>
            <div className="row">
                <div className="col-8 text-center mt-5 ">
                    <h1 className='display-5 text-light'>{ component === "Register"? "Get Plugged into our social media.":"WELCOME BACK!"}</h1>
                    <img src={ component === "Register"? "Group 477.svg":"Group 475.svg"} alt="guy" width={500} />
                    <h3 className='text-light fun-text'>{component === "Register"? "Join Millions Of Developer And Share The Fun Side Of Being a Developer":"We All Missed You!"}</h3>
                </div>
                { component === "Register"?
                
                <div className="col-4">
                    <Register />
                </div>
                :
                <div className="col-4">
                    <Login />
                </div>
                }
            </div>
        </div>
    )
}

export default LogReg