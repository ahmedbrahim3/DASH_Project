const Message = require("../models/Message");


const addMessage = async (req, res) => {
    try {
        const savedMessage = await Message.create(req.body);
        res.status(200).json(savedMessage);
      } catch (err) {
        res.status(500).json(err);
      }
};

const getMessagesForConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
 
  getMessagesForConversation,
  addMessage
};
