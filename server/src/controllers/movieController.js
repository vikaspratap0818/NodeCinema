import Movie from '../models/Movie.js';

// @desc    Get all custom movies
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req, res) => {
  try {
    // Only return movies that aren't auto-imported stubs
    const movies = await Movie.find({ genre: { $ne: 'Imported' } }).populate('addedBy', 'username email');
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get custom movie by ID
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('addedBy', 'username email');
    
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a custom movie
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = async (req, res) => {
  try {
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
      addedBy: req.user._id
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a custom movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res) => {
  try {
    const { title, description, posterImageUrl, releaseDate, trailerYouTubeLink, genre, category, customMovieId } = req.body;

    const movie = await Movie.findById(req.params.id);

    if (movie) {
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
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a custom movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      await Movie.deleteOne({ _id: movie._id });
      res.json({ message: 'Movie removed' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
