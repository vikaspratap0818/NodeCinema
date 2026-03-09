import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import watchmodeApi from '../services/watchmodeApi';
import useDebounce from '../hooks/useDebounce';
import MovieCard from '../components/movie/MovieCard';
import { MovieGridSkeleton } from '../components/common/Skeleton';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 600); // 600ms debounce
  
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('relevance');

  const observer = useRef();
  
  // Ref for intersection observer to trigger infinite scroll
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Sync URL query to local state only on initial mount/url changes
  useEffect(() => {
    if (initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Main Effect: Whenever debouncedQuery or page changes, fetch
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Watchmode list-titles or search endpoint with pagination
        // Depending on if their autocomplete is actually the only way to search
        // We will try to pass `page` to the autocomplete, or use the general /search/
        // Watchmode autocomplete provides image_url, whereas /search/ does not.
        const res = await watchmodeApi.get('/autocomplete-search/', {
          params: { search_value: debouncedQuery, search_type: 1 }
        });
        
        let fetchedData = res.data.results || [];

        // We will sort by Year if requested.
        if (sortOption !== 'relevance') {
          fetchedData.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        }

        setResults(prev => {
          if (page === 1) return fetchedData;
          return [...prev, ...fetchedData];
        });
        
        // If we got exactly 10 or 20 items, there might be more. Standard size is usually 10 or more.
        if (fetchedData.length > 0 && fetchedData.length % 10 === 0) {
           setHasMore(true);
        } else {
           setHasMore(false);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, page, sortOption]);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
    setResults([]);
    // Update URL 
    if (debouncedQuery.trim()) {
       setSearchParams({ q: debouncedQuery });
    }
  }, [debouncedQuery, setSearchParams]);

  return (
    <div className="search-page container">
      <div className="search-header">
        <input 
          type="text" 
          className="main-search-input" 
          placeholder="Search for movies, TV shows, and actors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="search-controls">
        <span className="results-count">
          {debouncedQuery ? `Showing results for "${debouncedQuery}"` : 'Enter a search term...'}
        </span>
        
        {results.length > 0 && (
          <select 
            className="sort-dropdown" 
            value={sortOption} 
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1); // Reset to page 1 to re-sort newly fetched data properly
            }}
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="year">Sort by Year</option>
          </select>
        )}
      </div>

      <div className="movie-grid">
        {results.map((movie, index) => {
          // If it's the last element, attach the observer ref
          if (results.length === index + 1) {
            return (
              <div ref={lastElementRef} key={`${movie.id}-${index}`}>
                <MovieCard movie={movie} />
              </div>
            );
          } else {
            return <MovieCard key={`${movie.id}-${index}`} movie={movie} />;
          }
        })}
      </div>

      {loading && <div style={{ marginTop: '2rem' }}><MovieGridSkeleton count={5} /></div>}
      
      {!loading && !hasMore && results.length > 0 && (
        <p className="end-msg">You've reached the end of the results.</p>
      )}

      {!loading && debouncedQuery && results.length === 0 && (
        <div className="no-results">
          <h2>No matching results found for "{debouncedQuery}".</h2>
          <p>Please try a different keyword or check your spelling.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
