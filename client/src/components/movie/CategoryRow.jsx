import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { MovieGridSkeleton } from '../common/Skeleton';
import './CategoryRow.css';

const CategoryRow = ({ title, movies, loading, isCustom = false, onSelectMovie }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-section">
      <h2 className="category-title">{title}</h2>
      
      <div className="category-row-wrapper">
        <button className="scroll-btn left" onClick={() => scroll('left')}>
          <ChevronLeft size={24} />
        </button>
        
        <div className="category-row" ref={rowRef}>
          {loading ? (
             <MovieGridSkeleton count={6} />
          ) : (
            movies?.map((movie, idx) => (
              <div key={movie.id || movie._id || idx} className="row-item">
                <MovieCard 
                  movie={movie} 
                  isCustom={isCustom} 
                  onSelect={() => onSelectMovie && onSelectMovie(movie)}
                />
              </div>
            ))
          )}
          {!loading && movies?.length === 0 && (
            <div className="empty-row">No movies found.</div>
          )}
        </div>

        <button className="scroll-btn right" onClick={() => scroll('right')}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default CategoryRow;
