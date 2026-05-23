import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAdmin as loginApi, fetchMe as fetchMeApi, registerAdmin as registerApi, getStoredUser, setStoredUser, clearStoredUser, setToken } from '../services/api';

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await loginApi(email, password);
    if (data.token) setToken(data.token);
    if (data.user) setStoredUser(data.user);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const data = await registerApi(name, email, password);
    if (data.user) setStoredUser(data.user);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const user = await fetchMeApi();
  if (user) setStoredUser(user);
  return user;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getStoredUser(),
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
      clearStoredUser();
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
        state.user = getStoredUser() || null;
        state.loading = false;
      });
  },
});

export const { setUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
