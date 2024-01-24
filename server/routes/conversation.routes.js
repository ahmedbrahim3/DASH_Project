
const conversationController = require("../controllers/conversation");

// New Conversation

module.exports=(app)=>{
    app.post("/api/conversation", conversationController.createConversation);

   
    app.get("/api/conversation/:userId", conversationController.getConversationsForUser);
    

    app.get(
      "/api/find/:firstUserId/:secondUserId",
      conversationController.findConversationBetweenUsers
    );
    
    }
