import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as apiService from "@/services/api";
import { User } from "@/types/index";
import { saveSession } from "@/services/auth.service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};


export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    payload: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiService.login(payload);

      const user = {
        id: data.user._id,
        name: data.user.name,
        username: data.user.username,
        email: data.user.email,
      };

      await saveSession(
        user,
        data.accessToken,
        data.refreshToken
      );

      return user;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ??
        "Something went wrong"
      );
    }
  }
);

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (payload: { email: string, password: string, username: string, name: string }, { rejectWithValue }) => {
    try {
      const data = await apiService.signup(payload);
      return data.message;

    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ??
        "Something went wrong"
      );
    }
  },
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    restoreSession(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "idle";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string ?? "Login failed";
      })
      .addCase(signupThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string ?? "Signup failed";
      });
  },
});

export const selectUser = (state: any) => state.auth.user;
export const isAuthenticated = (state: any) => state.auth.isAuthenticated;
export const isLoading = (state: any) => state.auth.status === 'loading';

export const { logout, clearAuthError, restoreSession } = authSlice.actions;
export default authSlice.reducer;
