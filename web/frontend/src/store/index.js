import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from './auth';
import filesReducer from './files';

const reducer = combineReducers({
    auth: authReducer,
    files: filesReducer
});

const store = configureStore({
    reducer: reducer
});

export default store;