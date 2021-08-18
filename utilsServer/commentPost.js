const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const uuid = require('uuid').v4;
const {
  newCommentNotification,
} = require('../utilsServer/notificationActions');

const commentPost = async (postId, userId, text) => {
  try {
    if (text.length < 1) {
      return { error: 'Comment should be at least 1 character' };
    }

    const post = await PostModel.findById(postId);

    if (!post) {
      return { error: 'No post found' };
    }

    const newComment = {
      _id: uuid(),
      user: userId,
      text,
      date: Date.now(),
    };

    await post.comments.unshift(newComment);
    await post.save();

    if (post.user.toString() !== userId) {
      await newCommentNotification(
        postId,
        newComment._id,
        userId,
        post.user.toString(),
        text
      );
    }

    const user = await UserModel.findById(userId);

    const { name, profilePicUrl, username } = user;

    return {
      success: true,
      name,
      profilePicUrl,
      username,
      postByUserId: post.user.toString(),
      commentId: newComment._id,
    };
  } catch (error) {
    return { error: 'Server error' };
  }
};

module.exports = { commentPost };
