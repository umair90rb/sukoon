import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchDashboardStats } from './fetchDashboard';

const initialState = {
  stats: {},
  fetchStatus: fetchStatus.IDLE,
  error: null,
  startPeriod: `${new Date(new Date().setHours(0, 0, 0, 0)).toLocaleString('en-GB', { hour12: false }).replace(',', '')}`,
  endPeriod: `${new Date().toLocaleString('en-GB', { hour12: false }).replace(',', '')}`
};

const itemSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardStatPeriod: (state, action) => {
      const { period, value } = action.payload;
      state[period] = value;
    },
    clearDashboardState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardStats.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.stats = data.stats;
      state.error = null;
    });
    builder.addCase(fetchDashboardStats.rejected, (state, action) => {
      state.stats = {};
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { setDashboardStatPeriod, clearDashboardState } = itemSlice.actions;
export default itemSlice.reducer;
