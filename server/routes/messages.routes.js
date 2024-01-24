
const messageController = require("../controllers/messages");


module.exports=(app)=>{

app.post("/api/message", messageController.addMessage);


app.get("/api/message/:conversationId", messageController.getMessagesForConversation);
}