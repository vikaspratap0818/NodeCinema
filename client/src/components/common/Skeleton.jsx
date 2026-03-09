import React from 'react';
import './Skeleton.css';

// Reusable Basic Skeleton Block
export const SkeletonBlock = ({ width, height, borderRadius, style }) => {
  return (
    <div 
      className="skeleton" 
      style={{ width, height, borderRadius: borderRadius || '8px', ...style }}
    ></div>
  );
};

// Skeleton for a Grid of Movies
export const MovieGridSkeleton = ({ count = 10 }) => {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="movie-card-skeleton">
          <SkeletonBlock width="100%" height="auto" style={{ aspectRatio: '2/3', borderRadius: '16px' }} />
          <div className="skeleton-info">
            <SkeletonBlock width="80%" height="20px" style={{ marginBottom: '8px' }} />
            <SkeletonBlock width="40%" height="16px" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton for Movie Details Page
export const MovieDetailSkeleton = () => {
  return (
    <div className="movie-detail-skeleton container">
      <div className="mds-backdrop">
         <SkeletonBlock width="100%" height="100%" borderRadius="0" />
      </div>
      <div className="mds-content">
        <SkeletonBlock width="300px" height="450px" borderRadius="16px" style={{ flexShrink: 0 }} />
        <div className="mds-info">
          <SkeletonBlock width="60%" height="40px" style={{ marginBottom: '20px' }} />
          <SkeletonBlock width="30%" height="24px" style={{ marginBottom: '30px' }} />
          
          <SkeletonBlock width="100%" height="16px" style={{ marginBottom: '10px' }} />
          <SkeletonBlock width="95%" height="16px" style={{ marginBottom: '10px' }} />
          <SkeletonBlock width="90%" height="16px" style={{ marginBottom: '30px' }} />
          
          <div style={{ display: 'flex', gap: '15px' }}>
             <SkeletonBlock width="150px" height="45px" borderRadius="24px" />
             <SkeletonBlock width="150px" height="45px" borderRadius="24px" />
          </div>
        </div>
      </div>
    </div>
  );
};
