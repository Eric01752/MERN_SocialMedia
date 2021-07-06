const UserModel = require('../models/UserModel');
const NotificationModel = require('../models/NotificationModel');

const setNotificationToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    if (!user.unreadNotification) {
      user.unreadNotification = true;
      await user.save();
    }

    return;
  } catch (error) {
    console.error(error);
  }
};

const newLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    const userToNotify = await NotificationModel.findOne({
      user: userToNotifyId,
    });

    const newNotification = {
      type: 'newLike',
      user: userId,
      post: postId,
      date: Date.now(),
    };

    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();

    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error) {
    console.error(error);
  }
};

const removeLikeNotification = async (userId, postId, userToNotifyId) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          notifications: { type: 'newLike', user: userId, post: postId },
        },
      }
    );

    return;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { newLikeNotification, removeLikeNotification };
