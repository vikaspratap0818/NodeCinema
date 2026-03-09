import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Ban/Unban user
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot ban admin user' });
      }
      user.status = user.status === 'active' ? 'banned' : 'active';
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        status: updatedUser.status
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle Favorite Movie
// @route   POST /api/users/favorites
// @access  Private
// @body    { mediaId, title, posterPath, mediaType }
export const toggleFavorite = async (req, res) => {
  try {
    const { mediaId, title, posterPath, mediaType } = req.body;
    
    if (!mediaId || !title) {
        return res.status(400).json({ message: 'Invalid payload: missing mediaId or title' });
    }

    const safeMediaId = mediaId.toString();

    const user = await User.findById(req.user._id);

    if (user) {
      const isFavorited = user.favorites.find((m) => m.mediaId === safeMediaId);

      if (isFavorited) {
        // Remove
        user.favorites = user.favorites.filter((m) => m.mediaId !== safeMediaId);
      } else {
        // Add
        user.favorites.push({ mediaId: safeMediaId, title, posterPath, mediaType });
      }

      await user.save();
      res.json(user.favorites);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add to Recent Watch History
// @route   POST /api/users/history
// @access  Private
// @body    { mediaId, title, posterPath, mediaType }
export const addWatchHistory = async (req, res) => {
  try {
    const { mediaId, title, posterPath, mediaType } = req.body;

    if (!mediaId || !title) {
        return res.status(400).json({ message: 'Invalid payload: missing mediaId or title' });
    }

    const safeMediaId = mediaId.toString();

    const user = await User.findById(req.user._id);

    if (user) {
      // Remove it if it already exists so we can push it to the top
      user.recentWatchHistory = user.recentWatchHistory.filter((m) => m.mediaId !== safeMediaId);
      
      // Add to beginning of array
      user.recentWatchHistory.unshift({ mediaId: safeMediaId, title, posterPath, mediaType });
      
      // Keep only last 20 movies
      if (user.recentWatchHistory.length > 20) {
        user.recentWatchHistory.pop();
      }

      await user.save();
      res.json(user.recentWatchHistory);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
