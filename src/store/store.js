import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
  },
});

export default store;
