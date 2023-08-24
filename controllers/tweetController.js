const Tweet = require('../models/tweet');

exports.createTweet = async (req, res) => {
  try {
    const { content } = req.body;
    const newTweet = new Tweet({ content, user: req.user.userId });
    await newTweet.save();
    res.status(201).json({ message: 'Tweet created successfully', tweet: newTweet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.editTweet = async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const { content } = req.body;
    const updatedTweet = await Tweet.findOneAndUpdate(
      { _id: tweetId, user: req.user.userId },
      { content, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedTweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }
    res.status(200).json({ message: 'Tweet updated successfully', tweet: updatedTweet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTweet = async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    await Tweet.findOneAndDelete({ _id: tweetId, user: req.user.userId });
    res.status(200).json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTimeline = async (req, res) => {
    try {
      const currentUser = await User.findById(req.user.userId).populate('following');
      const followingUserIds = currentUser.following.map(user => user._id);
      
      const timelineTweets = await Tweet.find({ user: { $in: followingUserIds } })
        .sort({ createdAt: -1 })
        .populate('user', 'name');
  
      res.status(200).json({ timelineTweets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  