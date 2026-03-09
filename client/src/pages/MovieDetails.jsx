import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Plus, Check, X } from 'lucide-react';
import watchmodeApi from '../services/watchmodeApi';
import backendApi from '../services/backendApi';
import { updateFavorites, updateHistory } from '../features/authSlice';
import { MovieDetailSkeleton } from '../components/common/Skeleton';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isCustom = searchParams.get('custom') === 'true';

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // Check if movie is already in favorites
  const isFavorite = userInfo?.favorites?.some((m) => m.mediaId === id.toString());

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        let movieData;
        let tKey = null;

        if (isCustom) {
          const res = await backendApi.get(`/movies/${id}`);
          movieData = res.data;
          
          // Extract YouTube key from full URL for custom movies
          const urlObj = new URL(movieData.trailerYouTubeLink);
          tKey = urlObj.searchParams.get('v') || movieData.trailerYouTubeLink.split('/').pop();
        } else {
          // Watchmode Movie
          const res = await watchmodeApi.get(`/title/${id}/details/`);
          movieData = res.data;
          
          // Watchmode doesn't always provide raw trailer keys easily in standard details
          tKey = movieData.trailer || null;
        }

        setMovie(movieData);
        setTrailerKey(tKey);

        // Sync with Watch History
        if (userInfo) {
           const historyPayload = {
             mediaId: id.toString(),
             title: isCustom ? movieData.title : (movieData.title || movieData.name),
             posterPath: isCustom ? movieData.posterImageUrl : movieData.poster,
             mediaType: isCustom ? 'custom' : 'movie'
           };
           
           const historyRes = await backendApi.post('/users/history', historyPayload);
           dispatch(updateHistory(historyRes.data));
        }

      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0); // Scroll to top on load
  }, [id, isCustom, userInfo?._id]); // Only re-run if ID or user changes

  const handleFavoriteToggle = async () => {
    if (!userInfo) return alert('Please login to add favorites');
    
    try {
      const payload = {
        mediaId: id.toString(),
        title: isCustom ? movie.title : (movie.title || movie.name),
        posterPath: isCustom ? movie.posterImageUrl : movie.poster,
        mediaType: isCustom ? 'custom' : 'movie'
      };
      
      console.log('Sending Favorite Payload:', payload);
      const res = await backendApi.post('/users/favorites', payload);
      console.log('Received Favorites Response:', res.data);
      dispatch(updateFavorites(res.data));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      console.error('Error Response:', error.response?.data);
    }
  };

  if (loading) return <MovieDetailSkeleton />;
  if (!movie) return <div className="container" style={{paddingTop: '100px'}}><h2>Movie not found.</h2></div>;

  const title = movie.title || movie.name;
  const overview = movie.description || movie.plot_overview || 'Description not available.';
  const backdrop = isCustom ? movie.posterImageUrl : movie.poster !== 'N/A' ? movie.poster : '';
  const poster = isCustom ? movie.posterImageUrl : movie.poster !== 'N/A' ? movie.poster : '';

  const rating = isCustom ? null : movie.us_rating ? `Rated ${movie.us_rating}` : movie.user_rating ? `${movie.user_rating}/10 Match` : null;
  const year = isCustom 
      ? new Date(movie.releaseDate).getFullYear() 
      : movie.year;
      
  const runtimeMin = isCustom ? movie.runtime : movie.runtime_minutes || null;

  return (
    <div className="md-page">
      <div className="md-backdrop">
        <img src={backdrop} alt={title} />
        <div className="md-gradient"></div>
      </div>

      <div className="container md-content">
        <div className="md-poster-wrapper">
          <img src={poster} alt={title} className="md-poster" />
        </div>
        
        <div className="md-info">
          <h1 className="md-title">{title}</h1>
          
          <div className="md-meta">
            {rating && <span className="md-match">{rating}</span>}
            <span>{year}</span>
            {runtimeMin && <span>{Math.floor(runtimeMin / 60)}h {runtimeMin % 60}m</span>}
            <span className="md-hd">HD</span>
          </div>

          <p className="md-overview">{overview}</p>

          <div className="md-actions">
            <button 
               className="md-btn-play" 
               onClick={() => trailerKey ? setShowTrailer(true) : alert('Trailer for this movie is currently unavailable.')}
            >
              <Play size={20} fill="currentColor" /> Play Trailer
            </button>
            <button className={`md-btn-favorite ${isFavorite ? 'active' : ''}`} onClick={handleFavoriteToggle}>
              {isFavorite ? <Check size={20} /> : <Plus size={20} />} 
              {isFavorite ? 'Remove from List' : 'My List'}
            </button>
          </div>

          {!isCustom && movie.genre_names && movie.genre_names.length > 0 && (
            <div className="md-cast">
              <h3>Genres</h3>
              <p>{movie.genre_names.join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="trailer-modal">
          <div className="trailer-modal-backdrop" onClick={() => setShowTrailer(false)}></div>
          <div className="trailer-modal-content">
            <button className="trailer-close-btn" onClick={() => setShowTrailer(false)}>
              <X size={30} />
            </button>
            <div className="iframe-container">
              <iframe 
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
