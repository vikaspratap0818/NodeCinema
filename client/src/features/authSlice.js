import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    // Updates the full user object (favorites, history, profile image, etc.)
    updateUserInfo: (state, action) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    },
    updateFavorites: (state, action) => {
      if (state.userInfo) {
        state.userInfo.favorites = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    },
    updateHistory: (state, action) => {
      if (state.userInfo) {
        state.userInfo.recentWatchHistory = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    }
  },
});

export const { setCredentials, logout, updateUserInfo, updateFavorites, updateHistory } = authSlice.actions;

export default authSlice.reducer;
