const { createSlice } = require("@reduxjs/toolkit");

const fileSlice = createSlice({
    name: 'files',
    initialState: {
        searchFocus: false,
        file: null,
        editFile: false,
        searchResults: []
    },
    reducers: {
        searchFocus(state) {
            state.searchFocus = true;
        },
        searchResults(state, action) {
            state.searchResults = action.payload.searchResults;
        }
    }
});

// const store = configureStore({
//     reducer: { files: fileSlice.reducer }
// });

export const filesActions = fileSlice.actions;
export default fileSlice.reducer;