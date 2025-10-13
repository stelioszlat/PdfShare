const { createSlice } = require("@reduxjs/toolkit");
const { isValidToken } = require("../util/auth"); 

const isAuthenticated = isValidToken(localStorage.getItem('access_token'));
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: isAuthenticated,
        isAdmin: false,
        userId: null,
        currentUser: null,
        token: localStorage.getItem('access_token')
    },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.isAdmin = action.payload.isAdmin;
            state.userId = action.payload.userId;
            state.token = action.payload.token;
            localStorage.setItem('access_token', state.token);
            localStorage.setItem('userId', state.userId);
        },
        logout(state) {
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.userId = null;
            state.user = null;
            state.token = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('userId');
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