import { configureStore } from "@reduxjs/toolkit";

import authReducer from './auth';
import filesReducer from './files';

const store = configureStore({
    reducer: {
        auth: authReducer,
        files: filesReducer,
    }
});

export default store;