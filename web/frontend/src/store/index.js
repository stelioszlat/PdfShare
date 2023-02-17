const { configureStore } = require("@reduxjs/toolkit");

import authReducer from './auth';
import filesReducer from './files';
import formsReducer from './forms';
import pagesReducer from './pages';

const store = configureStore({
    reducer: {
        auth: authReducer,
        files: filesReducer,
        forms: formsReducer,
        pages: pagesReducer,
    }
});

export default store;