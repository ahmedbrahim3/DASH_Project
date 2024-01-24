import React, { useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";

export default function Conversation({conversation,curentUserId}) {  
    const [user,setUser]=useState([])

//   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
       useEffect(()=>{
        const friendId = conversation.members.filter((m) => m !== curentUserId)
        
         
        axios.get("http://localhost:8000/api/users/" + friendId)
        .then((res)=>{
        // console.log(res.data);
        setUser(res.data)
        console.log("eeezeqsdqsdA",user);
        }).catch((err)=>console.log(err))
       },[])
  return (
    <div className="conversation">
    
    
    <img
    className="conversationImg"
    src={user.image}
    alt=""
    />
    <span className="conversationName">{user.firstName}</span>
      
    </div>
  );
}
