import { configureStore } from '@reduxjs/toolkit';

import userReducer from './userSlice.js'

import adminReducer from './adminSlice.js'

export const store = configureStore({
    reducer :{
        user : userReducer,
        admin : adminReducer
    }
});
