import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import MovieCard from '../components/movie/MovieCard';
import './Profile.css';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' or 'history'

  const favorites = userInfo?.favorites || [];
  const history = userInfo?.recentWatchHistory || [];

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <div className="profile-avatar">
          {userInfo.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{userInfo.username}</h1>
          <p>{userInfo.email}</p>
          <span className="profile-role badge">{userInfo.role.toUpperCase()}</span>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          My List ({favorites.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Watch History ({history.length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'favorites' && (
           <div className="movie-grid">
             {favorites.length > 0 ? (
               favorites.map((item, idx) => (
                 <MovieCard 
                   key={idx} 
                   movie={{
                     id: item.mediaType !== 'custom' ? item.mediaId : null,
                     _id: item.mediaType === 'custom' ? item.mediaId : null,
                     name: item.title,
                     image_url: item.mediaType !== 'custom' ? item.posterPath : null,
                     posterImageUrl: item.mediaType === 'custom' ? item.posterPath : null
                   }} 
                   isCustom={item.mediaType === 'custom'} 
                 />
               ))
             ) : (
               <div className="empty-state">
                  <h3>Your list is empty.</h3>
                  <p>Add you favorite movies and TV shows to keep track of them.</p>
               </div>
             )}
           </div>
        )}

        {activeTab === 'history' && (
           <div className="movie-grid">
             {history.length > 0 ? (
               history.map((item, idx) => (
                 <MovieCard 
                   key={idx} 
                   movie={{
                     id: item.mediaType !== 'custom' ? item.mediaId : null,
                     _id: item.mediaType === 'custom' ? item.mediaId : null,
                     name: item.title,
                     image_url: item.mediaType !== 'custom' ? item.posterPath : null,
                     posterImageUrl: item.mediaType === 'custom' ? item.posterPath : null
                   }} 
                   isCustom={item.mediaType === 'custom'} 
                 />
               ))
             ) : (
               <div className="empty-state">
                  <h3>No watch history.</h3>
                  <p>Movies you view will appear here.</p>
               </div>
             )}
           </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
