import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
  loading: {
    global: false,
    tierList: false,
    auth: false
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: 'info',
        autoHide: true,
        duration: 5000,
        ...action.payload
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setTierListLoading: (state, action) => {
      state.loading.tierList = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.loading.auth = action.payload;
    }
  }
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebar,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setTierListLoading,
  setAuthLoading
} = uiSlice.actions;

export default uiSlice.reducer;