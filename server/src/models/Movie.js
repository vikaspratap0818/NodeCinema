import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  posterImageUrl: {
    type: String,
    required: [true, 'Poster Image URL is required']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  trailerYouTubeLink: {
    type: String,
    required: [true, 'YouTube Trailer Link is required']
  },
  genre: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: ['Movie', 'TV Show'],
    default: 'Movie'
  },
  // Allows the admin to associate a specific custom ID, or defaults to MongoDB ObjectId
  customMovieId: {
    type: String,
    unique: true,
    sparse: true
  },
  source: {
    type: String,
    enum: ['admin', 'imported'],
    default: 'admin'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
