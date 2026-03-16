import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// Helper to build a safe user response (no password)
const buildUserResponse = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  status: user.status,
  profileImage: user.profileImage || '',
  favorites: user.favorites,
  recentWatchHistory: user.recentWatchHistory,
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);
  res.json(buildUserResponse(user));
});

// @desc    Update user profile (username, email, profileImage)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);

  const { username, email, profileImage, password } = req.body;

  if (username) user.username = username;
  if (email) user.email = email;
  if (profileImage !== undefined) user.profileImage = profileImage;
  if (password) user.password = password; // pre-save hook will hash it

  const updatedUser = await user.save();
  res.json(buildUserResponse(updatedUser));
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'admin') throw new AppError('Cannot delete admin user', 400);

  await User.deleteOne({ _id: user._id });
  res.json({ message: 'User removed' });
});

// @desc    Ban/Unban user
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
export const toggleBanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'admin') throw new AppError('Cannot ban admin user', 400);

  user.status = user.status === 'active' ? 'banned' : 'active';
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    status: updatedUser.status
  });
});

// @desc    Toggle Favorite Movie
// @route   POST /api/users/favorites
// @access  Private
// @body    { mediaId, title, posterPath, mediaType }
export const toggleFavorite = asyncHandler(async (req, res) => {
  const { mediaId, title, posterPath, mediaType } = req.body;
  const safeMediaId = mediaId.toString();

  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);

  const isFavorited = user.favorites.find((m) => m.mediaId === safeMediaId);

  if (isFavorited) {
    user.favorites = user.favorites.filter((m) => m.mediaId !== safeMediaId);
  } else {
    user.favorites.push({ mediaId: safeMediaId, title, posterPath, mediaType });
  }

  await user.save();
  // Return full user response so frontend can sync everything
  res.json(buildUserResponse(user));
});

// @desc    Add to Recent Watch History
// @route   POST /api/users/history
// @access  Private
// @body    { mediaId, title, posterPath, mediaType }
export const addWatchHistory = asyncHandler(async (req, res) => {
  const { mediaId, title, posterPath, mediaType } = req.body;
  const safeMediaId = mediaId.toString();

  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found', 404);

  user.recentWatchHistory = user.recentWatchHistory.filter((m) => m.mediaId !== safeMediaId);
  user.recentWatchHistory.unshift({ mediaId: safeMediaId, title, posterPath, mediaType });

  if (user.recentWatchHistory.length > 20) {
    user.recentWatchHistory.pop();
  }

  await user.save();
  // Return full user response
  res.json(buildUserResponse(user));
});
