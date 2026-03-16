import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import './MovieCard.css';

const MovieCard = memo(({ movie, isCustom = false, onSelect }) => {
  const navigate = useNavigate();
  
  const posterPath = isCustom 
    ? movie.posterImageUrl 
    : movie.poster_path 
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` 
      : (movie.image_url || movie.poster || null);
  const title = isCustom ? movie.title : (movie.title || movie.name);
  const rating = isCustom ? null : (movie.vote_average ? movie.vote_average.toFixed(1) : (movie.user_rating || null));
  const id = isCustom ? movie._id : movie.id;
  const year = isCustom 
    ? (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'Unknown')
    : (movie.release_date ? movie.release_date.substring(0, 4) : movie.first_air_date ? movie.first_air_date.substring(0, 4) : (movie.year || 'Unknown'));

  const detailPath = `/movie/${id}${isCustom ? '?custom=true' : ''}`;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onSelect) {
       onSelect();
    } else {
       navigate(detailPath);
    }
  };

  return (
    <motion.div 
      className="movie-card-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={detailPath} className="movie-card">
        <div className="card-image-container">
          {posterPath ? (
            <img src={posterPath} alt={title} className="movie-poster" loading="lazy" />
          ) : (
            <div className="movie-poster-fallback">
              <span className="fallback-text">No Image</span>
            </div>
          )}
          
          <div className="card-overlay" onClick={handlePlayClick}>
            <div className="play-btn-circle" title="Play Trailer">
              <Play size={24} fill="currentColor" className="play-icon" />
            </div>
          </div>
          
          {rating && (
            <div className="rating-badge">
              <Star size={14} fill="#fbbf24" color="#fbbf24" />
              <span>{rating}</span>
            </div>
          )}
        </div>

        <div className="card-info">
          <h3 className="movie-title" title={title}>{title}</h3>
          <p className="movie-year">{year}</p>
        </div>
      </Link>
    </motion.div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
