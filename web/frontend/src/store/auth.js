const { createSlice } = require("@reduxjs/toolkit");


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        isAdmin: false,
        userId: null,
        currentUser: null,
        token: null
    },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.isAdmin = action.payload.isAdmin;
            state.userId = action.payload.userId;
            state.token = action.payload.token;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.userId = null;
            state.user = null;
            state.token = null;
        },
        saveUser(state, action) {
            state.user = action.payload.user;
        }
    }
});

// const store = configureStore({
//     reducer: { auth: authSlice.reducer }
// });

export const authActions = authSlice.actions;
export default authSlice.reducer;