import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, Edit3, Save, X, Heart, Clock } from 'lucide-react';
import backendApi from '../services/backendApi';
import { updateUserInfo } from '../features/authSlice';
import MovieCard from '../components/movie/MovieCard';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('favorites');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: userInfo?.username || '',
    email: userInfo?.email || '',
  });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const favorites = userInfo?.favorites || [];
  const history = userInfo?.recentWatchHistory || [];
  const profileImage = userInfo?.profileImage || '';

  // Convert image file to base64 and upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await backendApi.put('/users/profile', {
          profileImage: reader.result
        });
        dispatch(updateUserInfo(res.data));
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await backendApi.put('/users/profile', editData);
      dispatch(updateUserInfo(res.data));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Build a proper movie object for MovieCard from saved references
  const buildMovieObj = (item) => {
    const isCustom = item.mediaType === 'custom';
    return {
      id: !isCustom ? item.mediaId : undefined,
      _id: isCustom ? item.mediaId : undefined,
      title: item.title,
      name: item.title,
      poster_path: !isCustom && item.posterPath
        ? item.posterPath.replace('https://image.tmdb.org/t/p/w500', '').replace('https://image.tmdb.org/t/p/w342', '')
        : undefined,
      image_url: !isCustom ? item.posterPath : undefined,
      posterImageUrl: isCustom ? item.posterPath : undefined,
      mediaType: item.mediaType,
    };
  };

  return (
    <div className="profile-page container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar">
              {userInfo.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="avatar-overlay">
            <Camera size={20} />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        <div className="profile-info">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editData.username}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                className="edit-input"
                placeholder="Username"
              />
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="edit-input"
                placeholder="Email"
              />
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1>{userInfo.username}</h1>
              <p>{userInfo.email}</p>
              <div className="profile-meta">
                <span className="profile-role badge">{userInfo.role.toUpperCase()}</span>
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                  <Edit3 size={14} /> Edit Profile
                </button>
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-item">
            <Heart size={18} />
            <span className="stat-count">{favorites.length}</span>
            <span className="stat-label">Favorites</span>
          </div>
          <div className="stat-item">
            <Clock size={18} />
            <span className="stat-count">{history.length}</span>
            <span className="stat-label">Watched</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Heart size={16} /> My List ({favorites.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={16} /> Watch History ({history.length})
        </button>
      </div>

      {/* Content */}
      <div className="profile-content">
        {activeTab === 'favorites' && (
          <div className="movie-grid">
            {favorites.length > 0 ? (
              favorites.map((item, idx) => (
                <MovieCard
                  key={`fav-${item.mediaId}-${idx}`}
                  movie={buildMovieObj(item)}
                  isCustom={item.mediaType === 'custom'}
                />
              ))
            ) : (
              <div className="empty-state">
                <Heart size={48} className="empty-icon" />
                <h3>Your list is empty</h3>
                <p>Click the "My List" button on any movie to add it here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="movie-grid">
            {history.length > 0 ? (
              history.map((item, idx) => (
                <MovieCard
                  key={`hist-${item.mediaId}-${idx}`}
                  movie={buildMovieObj(item)}
                  isCustom={item.mediaType === 'custom'}
                />
              ))
            ) : (
              <div className="empty-state">
                <Clock size={48} className="empty-icon" />
                <h3>No watch history</h3>
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
