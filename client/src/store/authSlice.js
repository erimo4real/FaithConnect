import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAdmin as loginApi, fetchMe as fetchMeApi, registerAdmin as registerApi } from '../services/api';

export const login = createAsyncThunk('auth/login', async ({ email, password, remember }, { rejectWithValue }) => {
  try {
    const data = await loginApi(email, password, remember);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const data = await registerApi(name, email, password);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const user = await fetchMeApi();
  return user;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
