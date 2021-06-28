const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserModel = require('../models/UserModel');
const ProfileModel = require('../models/ProfileModel');
const FollowerModel = require('../models/FollowerModel');
const PostModel = require('../models/PostModel');

//Get profile info
router.get('/:username', authMiddleware, async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const profile = await ProfileModel.findOne({ user: user._id }).populate(
      'user'
    );

    const profileFollowStats = await FollowerModel.findOne({ user: user._id });

    return res.json({
      profile,
      followersLength:
        profileFollowStats.followers.length > 0
          ? profileFollowStats.followers.length
          : 0,
      followingLength:
        profileFollowStats.following.length > 0
          ? profileFollowStats.following.length
          : 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

//Get profile posts
router.get('/posts/:username', authMiddleware, async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const posts = await PostModel.find({ user: user._id })
      .sort({
        createdAt: -1,
      })
      .populate('user')
      .populate('comments.user');

    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
