const Conversation = require("../models/Conversation");

// Function to create a new conversation
const createConversation = async (req, res) => {
    try {
        const savedConversation = await Conversation.create({
          members: [req.body.senderId, req.body.receiverId],
        });
        res.status(200).json(savedConversation);
      } catch (err) {
        res.status(500).json(err);
      }
};

// Function to get conversations for a user
const getConversationsForUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log("User ID:", userId);
      const conversations = await Conversation.find({
        members: { $regex: userId },
      });
      res.status(200).json(conversations);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  };

// Function to find a conversation between two users
const findConversationBetweenUsers = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createConversation,
  getConversationsForUser,
  findConversationBetweenUsers,
};
