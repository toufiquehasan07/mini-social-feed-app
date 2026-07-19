import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Notification } from "@/types";
import * as apiClient from '@/services/api';

interface NotificationsState {
  items: Notification[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchNotifications = createAsyncThunk("notifications/fetch", async (_, { rejectWithValue }) => {
  try {
    const notifications = await apiClient.getUserNotifications();
    // console.log("notification inside thunk: ", notifications);
    return notifications;
  } catch (err: any) {
    // console.error("error in getting user notifications: ", err);
    rejectWithValue(err.message || "Failed to load notifications");
  }
});


const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: any) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const selectNotifications = (state: any) => state.notifications.items;
export const selectNotificationErr = (state: any) => state.notifications.error;
export const selectNotificationStatus = (state: any) => state.notifications.status;

export default notificationsSlice.reducer;
