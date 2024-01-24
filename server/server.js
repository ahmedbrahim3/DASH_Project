const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.port;

// MIDDLEWARE
app.use(
  express.json(),
  express.urlencoded({ extended: true }),
);
app.use(cookieParser())
app.use( cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST","PATCH","DELETE","PUT"],
  }))

// CONFIG
require("./config/mongoose.config");

// ROUTES
require("./routes/conversation.routes")(app);
require("./routes/messages.routes")(app);
require("./routes/user.routes")(app);
require("./routes/post.routes")(app);
require("./routes/comment.routes")(app);
const OPENAI_API_KEY = "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"; 

app.post("/api/chat/gpt", async (req, res) => {
  const option = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: req.body.message,
        },
      ],
      max_tokens: 2048,
    }),
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", option);
    const data = await response.json(); // Invoke json() method
    res.send(data);
  } catch (error) {
    console.error("Error processing ChatGPT request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => console.log("LISTENING ON PORT: " + port));
