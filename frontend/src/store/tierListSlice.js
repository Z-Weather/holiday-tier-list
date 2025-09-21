import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tierListService from '../services/tierListService';

const initialState = {
  tierLists: [],
  currentTierList: null,
  userTierLists: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

export const fetchTierLists = createAsyncThunk(
  'tierList/fetchTierLists',
  async ({ page = 1, limit = 10, sort = 'newest', search = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await tierListService.getTierLists({ page, limit, sort, search });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tier lists');
    }
  }
);

export const fetchTierListById = createAsyncThunk(
  'tierList/fetchTierListById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tierListService.getTierListById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tier list');
    }
  }
);

export const createTierList = createAsyncThunk(
  'tierList/createTierList',
  async (tierListData, { rejectWithValue }) => {
    try {
      const response = await tierListService.createTierList(tierListData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tier list');
    }
  }
);

export const updateTierList = createAsyncThunk(
  'tierList/updateTierList',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await tierListService.updateTierList(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tier list');
    }
  }
);

export const deleteTierList = createAsyncThunk(
  'tierList/deleteTierList',
  async (id, { rejectWithValue }) => {
    try {
      await tierListService.deleteTierList(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tier list');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'tierList/toggleLike',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tierListService.toggleLike(id);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const fetchUserTierLists = createAsyncThunk(
  'tierList/fetchUserTierLists',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await tierListService.getUserTierLists({ page, limit });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user tier lists');
    }
  }
);

const tierListSlice = createSlice({
  name: 'tierList',
  initialState,
  reducers: {
    clearCurrentTierList: (state) => {
      state.currentTierList = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCurrentTierListTiers: (state, action) => {
      if (state.currentTierList) {
        state.currentTierList.tiers = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTierLists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTierLists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tierLists = action.payload.tierLists;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTierLists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTierListById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTierListById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTierList = action.payload;
      })
      .addCase(fetchTierListById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createTierList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTierList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tierLists.unshift(action.payload);
        state.userTierLists.unshift(action.payload);
      })
      .addCase(createTierList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateTierList.fulfilled, (state, action) => {
        const index = state.tierLists.findIndex(tl => tl._id === action.payload._id);
        if (index !== -1) {
          state.tierLists[index] = action.payload;
        }
        if (state.currentTierList && state.currentTierList._id === action.payload._id) {
          state.currentTierList = action.payload;
        }
      })
      .addCase(deleteTierList.fulfilled, (state, action) => {
        state.tierLists = state.tierLists.filter(tl => tl._id !== action.payload);
        state.userTierLists = state.userTierLists.filter(tl => tl._id !== action.payload);
        if (state.currentTierList && state.currentTierList._id === action.payload) {
          state.currentTierList = null;
        }
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { id, liked, totalLikes } = action.payload;
        const tierList = state.tierLists.find(tl => tl._id === id);
        if (tierList) {
          tierList.stats.totalLikes = totalLikes;
        }
        if (state.currentTierList && state.currentTierList._id === id) {
          state.currentTierList.stats.totalLikes = totalLikes;
        }
      })
      .addCase(fetchUserTierLists.fulfilled, (state, action) => {
        state.userTierLists = action.payload.tierLists;
      });
  }
});

export const { clearCurrentTierList, clearError, updateCurrentTierListTiers } = tierListSlice.actions;
export default tierListSlice.reducer;