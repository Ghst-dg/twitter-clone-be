const User = require('../models/user');

exports.followUser = async (req, res) => {
  try {
    const userIdToFollow = req.params.userId;
    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.user.userId);
    if (currentUser.following.includes(userIdToFollow)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(userIdToFollow);
    userToFollow.followers.push(currentUser._id);

    await Promise.all([currentUser.save(), userToFollow.save()]);

    res.status(200).json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const userIdToUnfollow = req.params.userId;
    const currentUser = await User.findById(req.user.userId);

    const followingIndex = currentUser.following.indexOf(userIdToUnfollow);
    if (followingIndex === -1) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    currentUser.following.splice(followingIndex, 1);

    const userToUnfollow = await User.findById(userIdToUnfollow);
    const followersIndex = userToUnfollow.followers.indexOf(currentUser._id);
    userToUnfollow.followers.splice(followersIndex, 1);

    await Promise.all([currentUser.save(), userToUnfollow.save()]);

    res.status(200).json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
