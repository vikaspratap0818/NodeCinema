import Movie from '../models/Movie.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// @desc    Get all custom movies (excludes auto-imported stubs)
// @route   GET /api/movies
// @access  Public
export const getMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find({ source: { $ne: 'imported' } })
    .populate('addedBy', 'username email')
    .sort({ createdAt: -1 });
  res.json(movies);
});

// @desc    Get custom movie by ID
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('addedBy', 'username email');

  if (!movie) throw new AppError('Movie not found', 404);
  res.json(movie);
});

// @desc    Create a custom movie
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = asyncHandler(async (req, res) => {
  const { title, description, posterImageUrl, releaseDate, trailerYouTubeLink, genre, category, customMovieId } = req.body;

  const movie = new Movie({
    title,
    description,
    posterImageUrl,
    releaseDate,
    trailerYouTubeLink,
    genre,
    category,
    customMovieId,
    source: 'admin',
    addedBy: req.user._id
  });

  const createdMovie = await movie.save();
  res.status(201).json(createdMovie);
});

// @desc    Update a custom movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = asyncHandler(async (req, res) => {
  const { title, description, posterImageUrl, releaseDate, trailerYouTubeLink, genre, category, customMovieId } = req.body;

  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new AppError('Movie not found', 404);

  movie.title = title || movie.title;
  movie.description = description || movie.description;
  movie.posterImageUrl = posterImageUrl || movie.posterImageUrl;
  movie.releaseDate = releaseDate || movie.releaseDate;
  movie.trailerYouTubeLink = trailerYouTubeLink || movie.trailerYouTubeLink;
  movie.genre = genre || movie.genre;
  movie.category = category || movie.category;
  movie.customMovieId = customMovieId || movie.customMovieId;

  const updatedMovie = await movie.save();
  res.json(updatedMovie);
});

// @desc    Delete a custom movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new AppError('Movie not found', 404);

  await Movie.deleteOne({ _id: movie._id });
  res.json({ message: 'Movie removed' });
});
