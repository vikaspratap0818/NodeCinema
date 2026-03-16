import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Plus, Check, X } from 'lucide-react';
import tmdbApi from '../services/tmdbApi';
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
          // TMDB Movie/TV
          try {
            const res = await tmdbApi.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } });
            movieData = res.data;
          } catch (err) {
            if (err.response && err.response.status === 404) {
               const tvRes = await tmdbApi.get(`/tv/${id}`, { params: { append_to_response: 'videos,credits' } });
               movieData = tvRes.data;
               movieData.title = movieData.name; // tv shows use name
            } else {
               throw err;
            }
          }
          
          const vids = movieData.videos?.results || [];
          const trailer = vids.find(v => v.type === 'Trailer' && v.site === 'YouTube') || vids.find(v => v.site === 'YouTube');
          tKey = trailer ? trailer.key : null;
        }

        setMovie(movieData);
        setTrailerKey(tKey);

        // Sync with Watch History
        if (userInfo) {
           const historyPayload = {
             mediaId: id.toString(),
             title: isCustom ? movieData.title : (movieData.title || movieData.name),
             posterPath: isCustom ? movieData.posterImageUrl : (movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : ''),
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
        posterPath: isCustom ? movie.posterImageUrl : (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''),
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
  const overview = movie.overview || movie.description || movie.plot_overview || 'Description not available.';
  
  const backdropPath = movie.backdrop_path || movie.poster_path;
  const backdrop = isCustom ? movie.posterImageUrl : (backdropPath ? `https://image.tmdb.org/t/p/original${backdropPath}` : '');
  const poster = isCustom ? movie.posterImageUrl : (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '');

  const rating = isCustom ? null : (movie.vote_average ? `${movie.vote_average.toFixed(1)}/10 Rating` : null);
  const year = isCustom 
      ? new Date(movie.releaseDate).getFullYear() 
      : (movie.release_date ? movie.release_date.substring(0, 4) : movie.first_air_date ? movie.first_air_date.substring(0, 4) : 'Unknown');
      
  const runtimeMin = isCustom ? movie.runtime : (movie.runtime || (movie.episode_run_time && movie.episode_run_time[0]) || null);
  
  const director = !isCustom && movie.credits ? movie.credits.crew.find(c => c.job === 'Director') : null;
  const cast = !isCustom && movie.credits ? movie.credits.cast.slice(0, 5) : [];

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

          {!isCustom && (
             <div className="md-credits" style={{ marginBottom: '1.5rem', color: '#ccc' }}>
               {director && <p style={{marginBottom: '0.2rem'}}><strong>Director:</strong> {director.name}</p>}
               {cast.length > 0 && <p><strong>Cast:</strong> {cast.map(c => c.name).join(', ')}</p>}
             </div>
          )}

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

          {!isCustom && movie.genres && movie.genres.length > 0 && (
            <div className="md-cast">
              <h3>Genres</h3>
              <p>{movie.genres.map(g => g.name).join(', ')}</p>
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
