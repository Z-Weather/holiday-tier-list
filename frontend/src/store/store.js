import { configureStore } from '@reduxjs/toolkit';
import tierListReducer from './tierListSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    tierList: tierListReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;