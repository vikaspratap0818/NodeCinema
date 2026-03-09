import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Star, StopCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import watchmodeApi from '../../services/watchmodeApi';
import backendApi from '../../services/backendApi';
import './MovieCard.css';

const MovieCard = ({ movie, isCustom = false, onSelect }) => {
  const posterPath = isCustom ? movie.posterImageUrl : movie.image_url || movie.poster || null;
  const title = isCustom ? movie.title : (movie.name || movie.title);
  const rating = isCustom ? null : movie.user_rating ? movie.user_rating : null;
  const id = isCustom ? movie._id : movie.id;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If onSelect is provided (e.g. in a CategoryRow), use it to expand the player
    if (onSelect) {
       onSelect();
    } else {
       // Otherwise fallback to details page
       window.location.href = `/movie/${id}${isCustom ? '?custom=true' : ''}`;
    }
  };

  return (
    <motion.div 
      className="movie-card-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/movie/${id}${isCustom ? '?custom=true' : ''}`} className="movie-card">
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
          <p className="movie-year">
            {isCustom ? new Date(movie.releaseDate).getFullYear() : (movie.year || 'Unknown')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
