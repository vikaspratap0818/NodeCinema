import React, { useState, useEffect } from 'react';
import tmdbApi from '../../services/tmdbApi';
import backendApi from '../../services/backendApi';
import { RefreshCw } from 'lucide-react';
import './TrailerPlayer.css';

const TrailerPlayer = ({ movie, isCustom }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie) return;
      
      setLoading(true);
      setError(null);
      setTrailerKey(null);
      
      try {
        const id = isCustom ? movie._id : movie.id;
        let tKey = null;

         if (isCustom) {
           const res = await backendApi.get(`/movies/${id}`);
           const urlObj = new URL(res.data.trailerYouTubeLink);
           tKey = urlObj.searchParams.get('v') || res.data.trailerYouTubeLink.split('/').pop();
         } else {
           try {
             let vids = [];
             try {
                const res = await tmdbApi.get(`/movie/${id}/videos`);
                vids = res.data.results || [];
             } catch (err) {
                if (err.response && err.response.status === 404) {
                   const tvRes = await tmdbApi.get(`/tv/${id}/videos`);
                   vids = tvRes.data.results || [];
                } else {
                   throw err;
                }
             }
             const trailer = vids.find(v => v.type === 'Trailer' && v.site === 'YouTube') || vids.find(v => v.site === 'YouTube');
             if (trailer) {
                tKey = trailer.key;
             }
           } catch(err) {
              tKey = null;
           }
         }

        if (tKey) {
           setTrailerKey(tKey.replace('watch?v=', ''));
        } else {
           setError("No trailer available for this title.");
        }
      } catch (err) {
         setError("Failed to load trailer.");
      } finally {
         setLoading(false);
      }
    };

    fetchTrailer();
  }, [movie, isCustom]);

  if (loading) {
     return (
       <div className="trailer-player-placeholder">
         <RefreshCw size={40} className="animate-spin text-muted" />
       </div>
     );
  }

  if (error || !trailerKey) {
     return (
       <div className="trailer-player-placeholder error">
          <p>{error || "Trailer unavailable"}</p>
       </div>
     );
  }

  return (
    <div className="trailer-player-wrapper">
       <iframe 
         src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&origin=${window.location.origin}`} 
         title="YouTube video player" 
         frameBorder="0" 
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
         allowFullScreen
         className="trailer-player-iframe"
       ></iframe>
    </div>
  );
};

export default TrailerPlayer;
