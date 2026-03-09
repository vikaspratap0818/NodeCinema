import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js';
import movieReducer from '../features/movieSlice.js';
// We can also have an adminUserSlice or uiSlice if needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
  },
});

export default store;
