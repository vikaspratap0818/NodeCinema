import React, { useState, useEffect } from 'react';
import watchmodeApi from '../../services/watchmodeApi';
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
           const res = await watchmodeApi.get(`/title/${id}/details/`);
           if (res.data?.trailer) {
             try {
                if (res.data.trailer.includes('youtube.com') || res.data.trailer.includes('youtu.be')) {
                  const ytUrl = new URL(res.data.trailer);
                  tKey = ytUrl.searchParams.get('v') || res.data.trailer.split('/').pop();
                } else {
                  tKey = res.data.trailer.split('/').pop();
                }
             } catch(err) {
                tKey = null;
             }
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
