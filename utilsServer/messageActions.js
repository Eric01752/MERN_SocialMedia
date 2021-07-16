const ChatModel = require('../models/ChatModel');

const loadMessages = async (userId, messagesWith) => {
  try {
    const user = await ChatModel.findOne({ user: userId }).populate(
      'chats.messagesWith'
    );

    const chat = user.chats.find(
      (chat) => chat.messagesWith._id.toString() === messagesWith
    );

    if (!chat) {
      return { error: 'No chat found' };
    }

    return { chat };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

module.exports = { loadMessages };
