import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash, Edit, Ban, CheckCircle } from 'lucide-react';
import backendApi from '../../services/backendApi';
import { fetchCustomMovies } from '../../features/movieSlice';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { customMovies } = useSelector((state) => state.movies);
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' or 'users'
  const [users, setUsers] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', posterImageUrl: '', releaseDate: '',
    trailerYouTubeLink: '', genre: '', category: 'Movie',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomMovies());
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [dispatch, activeTab]);

  const fetchUsers = async () => {
    try {
      const res = await backendApi.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        genre: formData.genre.split(',').map(g => g.trim())
      };

      if (editingId) {
        await backendApi.put(`/movies/${editingId}`, payload);
        alert('Movie updated!');
      } else {
        await backendApi.post('/movies', payload);
        alert('Movie added!');
      }
      
      setFormData({ title: '', description: '', posterImageUrl: '', releaseDate: '', trailerYouTubeLink: '', genre: '', category: 'Movie' });
      setEditingId(null);
      dispatch(fetchCustomMovies());
    } catch (error) {
       alert(error.response?.data?.message || 'Error saving movie');
    }
  };

  const editMovie = (movie) => {
    setEditingId(movie._id);
    setFormData({
      title: movie.title,
      description: movie.description,
      posterImageUrl: movie.posterImageUrl,
      releaseDate: movie.releaseDate.split('T')[0],
      trailerYouTubeLink: movie.trailerYouTubeLink,
      genre: movie.genre.join(', '),
      category: movie.category
    });
    window.scrollTo(0, 0);
  };

  const deleteMovie = async (id) => {
    if (window.confirm('Delete this movie?')) {
      try {
        await backendApi.delete(`/movies/${id}`);
        dispatch(fetchCustomMovies());
      } catch (err) {
        alert('Failed to delete movie');
      }
    }
  };

  const toggleBan = async (id) => {
    try {
      await backendApi.put(`/users/${id}/ban`);
      fetchUsers();
    } catch (err) {
      alert('Failed to ban user');
    }
  };

  const deleteUser = async (id, role) => {
    if (role === 'admin') return alert('Cannot delete an admin.');
    if (window.confirm('Permanently delete this user?')) {
       try {
         await backendApi.delete(`/users/${id}`);
         fetchUsers();
       } catch (err) {
         alert('Failed to delete user');
       }
    }
  };

  return (
    <div className="admin-page container">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button className={activeTab === 'movies' ? 'active' : ''} onClick={() => setActiveTab('movies')}>
          Manage Movies
        </button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
          Manage Users
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'movies' && (
          <>
            <div className="admin-form-card">
              <h2>{editingId ? 'Edit Movie' : 'Add Custom Movie'}</h2>
              <form onSubmit={handleMovieSubmit} className="admin-form">
                <div className="form-row">
                  <input type="text" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  <input type="text" placeholder="Poster Image URL" required value={formData.posterImageUrl} onChange={e => setFormData({...formData, posterImageUrl: e.target.value})} />
                </div>
                <div className="form-row">
                  <input type="date" required value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
                  <input type="text" placeholder="YouTube Trailer Link" required value={formData.trailerYouTubeLink} onChange={e => setFormData({...formData, trailerYouTubeLink: e.target.value})} />
                </div>
                <div className="form-row">
                  <input type="text" placeholder="Genre (comma separated)" required value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="Movie">Movie</option>
                    <option value="TV Show">TV Show</option>
                  </select>
                </div>
                <textarea rows="4" placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                
                <div className="form-actions">
                  <button type="submit" className="btn-save">{editingId ? 'Update Movie' : 'Add Movie'}</button>
                  {editingId && <button type="button" className="btn-cancel" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', posterImageUrl: '', releaseDate: '', trailerYouTubeLink: '', genre: '', category: 'Movie' }); }}>Cancel</button>}
                </div>
              </form>
            </div>

            <div className="admin-list-container">
              <h2>Added Movies ({customMovies.length})</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Added By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customMovies.map(movie => (
                    <tr key={movie._id}>
                      <td>{movie.title}</td>
                      <td>{movie.category}</td>
                      <td>{movie.addedBy.username}</td>
                      <td>
                        <button onClick={() => editMovie(movie)} className="action-btn edit" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => deleteMovie(movie._id)} className="action-btn delete" title="Delete"><Trash size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="admin-list-container">
            <h2>Registered Users ({users.length})</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status === 'active' ? <CheckCircle size={14} /> : <Ban size={14} />} 
                        {user.status}
                      </span>
                    </td>
                    <td>
                      {user.role !== 'admin' && (
                        <>
                          <button onClick={() => toggleBan(user._id)} className="action-btn warn" title={user.status === 'active' ? 'Ban' : 'Unban'}>
                            <Ban size={16} />
                          </button>
                          <button onClick={() => deleteUser(user._id, user.role)} className="action-btn delete" title="Delete">
                            <Trash size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
