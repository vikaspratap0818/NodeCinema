import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const savedMovieSchema = new mongoose.Schema({
  // Stores either a TMDB ID or our Custom Backend Movie ID
  mediaId: { type: String, required: true },
  title: { type: String, required: true },
  posterPath: { type: String },
  mediaType: { type: String, enum: ['movie', 'tv', 'custom'], required: true },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  },
  profileImage: {
    type: String,
    default: ''
  },
  favorites: [savedMovieSchema],
  recentWatchHistory: [savedMovieSchema]
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
export default User;
