import React, { useState, useEffect } from "react";
import axios from "axios";
import "./message.css";
import { format } from "timeago.js";
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { monokaiSublime } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function Message({ message, own, code, me }) {
  const [sender, setSender] = useState("");
  const [enlarged, setEnlarged] = useState(false);

  const getSender = () => {
    axios
      .get(`http://localhost:8000/api/users/${message.sender}`)
      .then((res) => setSender(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSender();
    console.log("ALAALAALAAL",message.sender)
  }, []);

  const isUrl = (text) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleTextImageClick = () => {
    setEnlarged(!enlarged);
  };

  function isJavaScriptCode(text) {
    const javascriptRegex = /\b(function|var|let|const|if|else|for|while|do|switch|case|break|continue|return)\b/g;
    return javascriptRegex.test(text);
  }

  return (
    <div className={own ? "message own" : "message"}>
      <div
        className={`messageTop ${enlarged ? "enlargedBackground" : ""}`}
        style={{
          position: "relative",
        }}
      >
        <img
          className="messageImg"
          src={sender.image}
          alt=""
        />
        {isUrl(message.text) ? (
          <img
            className={`messageImage ${enlarged ? "enlarged" : ""}`}
            src={message.text}
            alt="Message"
            onClick={handleTextImageClick}
            style={{
              width: enlarged ? "100%" : "200px",
              height: enlarged ? "auto" : "200px",
              cursor: "pointer",
            }}
          />
        ) : isJavaScriptCode(message.text) ? (
          <SyntaxHighlighter language="javascript" style={monokaiSublime} showLineNumbers>
            {message.text}
          </SyntaxHighlighter>
        ) : (
          <p className="messageText">{message.text}</p>
        )}
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
