import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.push(action.payload);
      state.unreadCount += 1;
    },
    removeNotifications: (state, action) => {
      state.items = state.items.filter(
        (item) => item.body._id !== action.payload
      );
    },
    clearUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, clearUnreadCount, removeNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
