import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chatOnline.css";

export default function ChatOnline({ online }) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (online && online.length > 0) {
      const fetchUsers = async () => {
        try {
          // Fetch user data for each online user
          const userPromises = online.map((user) =>
            axios.get(`http://localhost:8000/api/users/${user.userId}`)
          );

          // Wait for all promises to resolve
          const usersData = await Promise.all(userPromises);

          // Extract user data from responses
          const onlineUsersData = usersData.map((res) => res.data);

          // Update state with online users data
          setOnlineUsers(onlineUsersData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      // Call the fetchUsers function
      fetchUsers();
    }
  }, [online]);
console.log("onlineuser =",onlineUsers.length);
  return (
    <div className="chatOnline">
  {onlineUsers.length>0? 
    <div key={onlineUsers[0]._id} className="chatOnlineFriend">
      <div className="chatOnlineImgContainer">
        <img
          className="chatOnlineImg"
          src={onlineUsers[0].image}
          alt={onlineUsers[0].firstName}
        />
        <div className="chatOnlineBadge"></div>
      </div>
      <span className="chatOnlineName">{onlineUsers[0].firstName}</span>
    </div>
  :<div></div>
}
</div>

      );
    }
    