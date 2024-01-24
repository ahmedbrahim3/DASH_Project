import React, { useEffect, useState ,useRef} from 'react'
import axios from 'axios';
import "./messenger.css";
import Conversation from "../../components/conversation/conversation"
import Message from "../../components/message/message";
import ChatOnline from "../../components/chatOnline/chatOnline";
import '@fortawesome/fontawesome-free/css/all.css';

import { io } from "socket.io-client";

export default function Messenger() {
    function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUser, setOnlineUser] = useState(null);
  const [code, setCode] = useState(false);
  const socket = useRef();
  const scrollRef = useRef();
  const userId = getCookie('userId');
  // console.log(userId);
  useEffect(() => {
    socket.current = io("ws://localhost:8900"); 
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", userId);
    socket.current.on("getUsers", (users) => {
      console.log('dddddfxwvVsd  qdfh',users);
      const filteredUsers = users.filter((user) => user.userId !== userId);

    // Set the filtered users as the onlineUser state
    setOnlineUser(filteredUsers);
    // console.log('Online users after filtering:', onlineUser);
    });
    
  }, [userId]);
  useEffect(() => {
    console.log('Online users after filtering:', onlineUser);
  }, [onlineUser]);
const getConversations = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/conversation/" + userId);
    // console.log(res)
    setConversations(res.data);
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
    getConversations();
  }, [userId]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/message/" + currentChat?._id);
        setMessages(res.data);
        
        // const newdata=res.data;
        // console.log(newdata);
        // console.log(newdata[1].sender.trim() == "65a52f8d04e49fc2dba39981");
        // for (let i = 0; i < newdata.length; i++) {

        //     console.log("Sender ID:", newdata[i].sender);
        //     console.log("Sender Type:", typeof newdata[i].sender);
        //     console.log("Current ID:", "65a52f8d04e49fc2dba39981");
        //     console.log("Comparison:", newdata[i].sender == "65a52f8d04e49fc2dba39981");

        //     (newdata[i].sender === "65a52f8d04e49fc2dba39981") 
        //     ? console.log("its me xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxa") 
        //     : console.log("not me");
                
        //     }
            
        
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    

    // Upload the image immediately after setting the file
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("upload_preset", "ahmedsm");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dljarbi3r/image/upload",
        form
      );

      setNewMessage(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: userId,
      text: newMessage,
      conversationId: currentChat._id,
    };
   
    const receiverId = currentChat.members.find(
      (member) => member !== userId
    );

    socket.current.emit("sendMessage", {
      senderId: userId,
      receiverId,
      text: newMessage,
    });
    
    try {
      const res = await axios.post("http://localhost:8000/api/message", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
//   console.log(currentChat._id);  
const isUrl = (text) => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};
const handelCode=()=>{
  if(code){
    setCode(false)

  }
  else{
    setCode(true)
  }
}
  return (
    <>
      {/* Topbar component goes here */}
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              placeholder="Search for friends"
              className="chatMenuInput"
            />
            {conversations.map((e) => (
  <div onClick={() => setCurrentChat(e)}>
    <Conversation conversation={e} curentUserId={userId} />
  </div>
))}   
            
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
             {currentChat ? (
     <React.Fragment>
     <div className="chatBoxTop">
     {messages.map((m) => (
                 <div ref={scrollRef}>
                      <Message message={m} own={m.sender === userId} online={onlineUser} me={userId} code={code}/>
                    </div>
                  ))}
                  </div>
     </React.Fragment>
   ) : (
     <span className="noConversationText">
       Open a conversation to start a chat.
      </span>
)}
            <div className="scrollToBottom"></div>
          </div>
          <div className="chatBoxBottom">
          <div className="input-group">
 

          {isUrl(newMessage) ? (
            <img src={newMessage} alt="" width={200}/>  
          ) : (
            <div></div>
          )}
          
          <textarea
            className="form-control"
            placeholder="Type your message..."
            
              onChange={(e) => setNewMessage(e.target.value)}
              
              value={newMessage}
            ></textarea>
            
            <label className="input-group-text">
            <input type="file" className="d-none"  onChange={handleFileChange}/>
            <i className="fas fa-camera"></i>
          </label>
          <button type="button" className="btn reg-btn btn-outline-secondary"  onClick={handleSubmit}>
    <img className='sni' src="https://www.svgrepo.com/show/304577/code-snippet.svg" alt="" />
  </button>
          </div>
         
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            
            <ChatOnline online={onlineUser} setCurrentChat={setCurrentChat}/>
            
          </div>
        </div>
      </div>
    </>
  );
}
