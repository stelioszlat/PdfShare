const { createSlice, configureStore } = require("@reduxjs/toolkit");


const pagesSlice = createSlice({
    name: 'pages',
    initialState: {
        showLogin: true,
        showProfile: false,
        showAdmin: false,
        showMain: false,
    },
    reducers: {
        showLoginPage(state) {
            state.showLogin = true;
            state.showProfile = false;
            state.showAdmin = false;
            state.showMain = false;
        },
        showAdminPage(state) {
            state.showLogin = false;
            state.showProfile = false;
            state.showAdmin = true;
            state.showMain = false;
        },
        showMainPage(state) {
            state.showLogin = false;
            state.showProfile = false;
            state.showAdmin = false;
            state.showMain = true;
        },
        showProfilePage(state) {
            state.showLogin = false;
            state.showProfile = true;
            state.showAdmin = false;
            state.showMain = false;
        }
    }
});

const store = configureStore({
    reducer: { pages: pagesSlice.reducer }
});

export const pagesActions = pagesSlice.actions;
export default store;