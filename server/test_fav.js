import axios from 'axios';
import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function testFavorites() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movie-platform');
  const user = await User.findOne({ email: 'test@example.com' });
  if (!user) {
    console.log("No test user found. Please create one.");
    process.exit(0);
  }
  
  console.log("Found user. Current favorites:", user.favorites.length);
  // Add a favorite
  user.favorites.push({ mediaId: '12345', title: 'Test Movie', mediaType: 'movie' });
  await user.save();
  console.log("Saved user. New favorites:", user.favorites.length);
  process.exit(0);
}

testFavorites();
