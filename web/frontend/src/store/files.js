const { createSlice, configureStore } = require("@reduxjs/toolkit");

const filesSlice = createSlice({
    name: 'files',
    initialState: {
        searchFocus: false,
        showFiles: false,
        file: null,
        editFile: false
    },
    reducers: {

    }
});

const store = configureStore({
    reducer: { files: filesSlice.reducer }
});

export const filesActions = filesSlice.actions;
export default store;