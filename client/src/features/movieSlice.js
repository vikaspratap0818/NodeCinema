import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import backendApi from '../services/backendApi';

// Thunk to fetch custom movies from the Admin route
export const fetchCustomMovies = createAsyncThunk(
  'movies/fetchCustom',
  async (_, thunkAPI) => {
    try {
      const response = await backendApi.get('/movies');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const initialState = {
  customMovies: [],
  loading: false,
  error: null,
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.customMovies = action.payload;
      })
      .addCase(fetchCustomMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default movieSlice.reducer;
