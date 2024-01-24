import React from "react";
import { useEffect, useState } from "react";
import "./AI.css"

function AI() {

  /* Main chat container */
/* Main chat container */
const deepChatContainerStyles = {
  borderRadius: "10px",
  borderColor: "#e4e4e4",
  background: "linear-gradient(90deg, rgb(239, 242, 247) 0%, 7.60286%, rgb(237, 240, 249) 15.2057%, 20.7513%, rgb(235, 239, 248) 26.297%, 27.6386%, rgb(235, 239, 248) 28.9803%, 38.2826%, rgb(231, 237, 249) 47.585%, 48.1216%, rgb(230, 236, 250) 48.6583%, 53.1306%, rgb(228, 236, 249) 57.6029%, 61.5385%, rgb(227, 234, 250) 65.4741%, 68.7835%, rgb(222, 234, 250) 72.093%, 75.7603%, rgb(219, 230, 248) 79.4275%, 82.8265%, rgb(216, 229, 248) 86.2254%, 87.8354%, rgb(213, 228, 249) 89.4454%, 91.8605%, rgb(210, 226, 249) 94.2755%, 95.4383%, rgb(209, 225, 248) 96.6011%, 98.3005%, rgb(208, 224, 247) 100%)",
};

/* Text input styles */
const s = {
  borderRadius: "20px",
  border: "unset",
  width: "78%",
  marginLeft: "-15px",
  boxShadow: "0px 0.3px 0.9px rgba(0, 0, 0, 0.12), 0px 1.6px 3.6px rgba(0, 0, 0, 0.16)",
};

const deepChatTextStyles = {
  padding: "10px",
  paddingLeft: "15px",
  paddingRight: "34px",
};

/* Placeholder styles */
const deepChatPlaceholderStyles = {
  text: "Ask me anything...",
  color: "#606060",
};

/* Message styles */
const deepChatBubbleStyles = {
  backgroundColor: "unset",
  marginTop: "10px",
  marginBottom: "10px",
  boxShadow: "0px 0.3px 0.9px rgba(0, 0, 0, 0.12), 0px 1.6px 3.6px rgba(0, 0, 0, 0.16)",
};

const deepChatUserBubbleStyles = {
  background: "linear-gradient(130deg, #2870EA 20%, #1B4AEF 77.5%)",
};

const deepChatAIBubbleStyles = {
  background: "rgba(255,255,255,0.7)",
};

/* Microphone button styles */
const deepChatMicrophoneStyles = {
  /* Adjust styles based on your requirements */
};

/* Submit button styles */
const deepChatSubmitContainerStyles = {
  position: "outside-right",
};

const deepChatSubmitStyles = {
  container: {
    default: {
      bottom: "0.75em",
      borderRadius: "25px",
      padding: "5px",
      backgroundColor: "unset",
    },
    hover: {
      backgroundColor: "#b0deff4f",
    },
    click: {
      backgroundColor: "#b0deffb5",
    },
  },
};

/* Loading styles */
const deepChatLoadingStyles = {
  /* Adjust styles based on your requirements */
};

/* Stop button styles */
const deepChatStopContainerStyles = {
  hover: {
    backgroundColor: "#ededed94",
  },
};

  
  const chatStyle = {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  };

  const containerStyle = {
    width: "300px",
    height: "400px",
    overflowY: "scroll",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    boxSizing: "border-box",
    marginBottom: "10px",
  };

  const messageStyle = {
    marginBottom: "10px",
    padding: "8px",
    borderRadius: "5px",
    maxWidth: "80%",
  };

  const userStyle = {
    textAlign: "right",
    backgroundColor: "#2ecc71",
    color: "#fff",
  };

  const assistantStyle = {
    textAlign: "left",
    backgroundColor: "#3498db",
    color: "#fff",
  };

  const inputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const textareaStyle = {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  };

  const sendButtonStyle = {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    cursor: "pointer",
  };

  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState(null);
  const [value, setValue] = useState(null);
  const [perviousChats, setPerviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-type": "application/json",
      },
    };
   

    try {
      const response = await fetch(
        "http://localhost:8000/api/chat/gpt",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    // Use the isFetching state to control when to make the API call
    if (isFetching) {
      getMessages();
    }
  }, [isFetching]);

  const handleSendMessage = () => {
    // Set isFetching to true when the button is clicked to trigger the API call
    setIsFetching(true);
    // setValue("")
  };

  useEffect(() => {
    console.log(message, currentTitle, value);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPerviousChats((perChats) => [
        ...perChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);
  console.log(perviousChats);
  const currentChat = perviousChats.filter(
    (perviousChat) => perviousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(perviousChats.map((perviousChat) => perviousChat.title))
  );
  console.log(uniqueTitles);
  return (
    <div style={deepChatContainerStyles}>
     
      
    <div className="chat-card">
    <div className="chat-header">
      <div className="h2">ChatGPT</div>
      
    </div>
    <div className="chat-body">
    {currentChat.map((chatMessage, index) => (
      <div className={chatMessage.role === 'user' ? 'message outgoing' : 'message incoming'}>
        <p>{chatMessage.content}</p>
      </div>
    ))}
     
    
     
    </div>
    <div className="chat-footer">
    <button onClick={createNewChat}>New Chat</button>
      <input value={value}
      placeholder="Type your message..."
      
      onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  </div>
    </div>
  );
}

export default AI;
