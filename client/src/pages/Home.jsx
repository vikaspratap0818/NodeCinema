import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Play, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';
import tmdbApi from '../services/tmdbApi';
import { fetchCustomMovies } from '../features/movieSlice';
import CategoryRow from '../components/movie/CategoryRow';
import TrailerPlayer from '../components/movie/TrailerPlayer';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { customMovies, loading: customLoading } = useSelector((state) => state.movies);

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hero section movie
  const [heroMovie, setHeroMovie] = useState(null);
  
  // Centralized floating trailer modal state
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomMovies());

    const fetchTmdbData = async () => {
      setLoading(true);
      try {
        const [trendingRes, popularRes, topRatedRes, tvRes] = await Promise.all([
          tmdbApi.get('/trending/movie/day'),
          tmdbApi.get('/movie/popular'),
          tmdbApi.get('/movie/top_rated'),
          tmdbApi.get('/trending/tv/day')
        ]);

        const trendingData = trendingRes.data.results || [];
        setTrending(trendingData);
        setPopular(popularRes.data.results || []);
        setTopRated(topRatedRes.data.results || []);
        setTvShows(tvRes.data.results || []);

        // Pick a random trending movie for the Hero section
        if (trendingData.length > 0) {
          const randomHero = trendingData[Math.floor(Math.random() * trendingData.length)];
          setHeroMovie(randomHero);
        }

      } catch (error) {
        console.error('Error fetching from TMDB:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTmdbData();
  }, [dispatch]);

  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero">
        {heroMovie ? (
          <>
            <div className="hero-backdrop">
              <img 
                src={heroMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}` : "https://via.placeholder.com/1200x500"} 
                alt={heroMovie.title || heroMovie.name} 
              />
              <div className="hero-gradient"></div>
            </div>
            
            <div className="container hero-content">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hero-info"
              >
                <h1 className="hero-title">{heroMovie.title || heroMovie.name}</h1>
                <p className="hero-overview">
                  {heroMovie.overview ? heroMovie.overview.substring(0, 200) + '...' : 'Discover this trending movie now.'}
                </p>
                <div className="hero-buttons">
                  <Link to={`/movie/${heroMovie.id}`} className="btn-secondary">
                    <Info size={20} /> More Info
                  </Link>
                </div>
              </motion.div>
            </div>
          </>
        ) : (
           <div className="hero-placeholder skeleton"></div>
        )}
      </div>

      <div className="container movie-sections">
        {/* Custom Admin Movies from Backend */}
        {customMovies && customMovies.length > 0 && (
           <CategoryRow 
              title="Featured Originals" 
              movies={customMovies} 
              loading={customLoading} 
              isCustom={true} 
              onSelectMovie={setActiveTrailerMovie}
           />
        )}
        
        {/* TMDB Rows */}
        <CategoryRow title="🔥 Trending Now" movies={trending} loading={loading} onSelectMovie={setActiveTrailerMovie} />
        <CategoryRow title="Popular Movies" movies={popular} loading={loading} onSelectMovie={setActiveTrailerMovie} />
        <CategoryRow title="Top Rated" movies={topRated} loading={loading} onSelectMovie={setActiveTrailerMovie} />
        <CategoryRow title="Trending TV Shows" movies={tvShows} loading={loading} onSelectMovie={setActiveTrailerMovie} />
      </div>

      {/* Floating Trailer Modal */}
      {activeTrailerMovie && (
        <div className="floating-trailer-modal">
          <div className="trailer-modal-backdrop" onClick={() => setActiveTrailerMovie(null)}></div>
          <div className="trailer-modal-content">
            <button className="trailer-close-btn" onClick={() => setActiveTrailerMovie(null)}>
              <X size={30} />
            </button>
            <div className="trailer-modal-body">
               <div className="trailer-modal-info">
                  <h2>{activeTrailerMovie.title || activeTrailerMovie.name}</h2>
                  <p className="trailer-modal-overview">
                    {activeTrailerMovie.overview || "Loading description..."}
                  </p>
                  <button 
                    className="btn-secondary" 
                    onClick={() => window.location.href = `/movie/${activeTrailerMovie.id || activeTrailerMovie._id}${(activeTrailerMovie.mediaType === 'custom' || activeTrailerMovie.posterImageUrl) ? '?custom=true' : ''}`}
                  >
                    More Info
                  </button>
               </div>
               <div className="trailer-modal-video">
                  <TrailerPlayer 
                     movie={activeTrailerMovie} 
                     isCustom={!!activeTrailerMovie.posterImageUrl} 
                  />
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
