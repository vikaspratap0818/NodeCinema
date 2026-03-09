import axios from 'axios';
import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

async function testApiFavorites() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movie-platform');
  const user = await User.findOne({ email: 'test@example.com' });
  if (!user) {
    console.log("No test user found.");
    process.exit(1);
  }

  // Generate a valid JWT token for the user
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Simulate frontend payload
  const payload = {
    mediaId: 99999, // Integer instead of string
    title: 'Test Movie Toggle API',
    posterPath: '/testpath.jpg',
    mediaType: 'movie'
  };

  try {
     console.log('Sending Add Request with Number ID...');
     const res1 = await axios.post('http://localhost:5000/api/users/favorites', payload, {
        headers: { Cookie: `jwt=${token}` }
     });
     console.log('Add Favorites Response (Length):', res1.data.length);
     
     const hasId = res1.data.some(m => m.mediaId === '99999');
     console.log('Successfully added as string:', hasId);

     console.log('Sending Remove Request with Number ID...');
     const res2 = await axios.post('http://localhost:5000/api/users/favorites', payload, {
        headers: { Cookie: `jwt=${token}` }
     });
     console.log('Remove Favorites Response (Length):', res2.data.length);

     const stillHasId = res2.data.some(m => m.mediaId === '99999');
     console.log('Successfully removed as string:', !stillHasId);
     
     if (hasId && !stillHasId) {
        console.log("SUCCESS: API Controller perfectly handles and casts numeric IDs to strings and toggles states!");
     }
  } catch (error) {
     console.error('API Error:', error.response?.data || error.message);
  }
  
  process.exit(0);
}

testApiFavorites();
