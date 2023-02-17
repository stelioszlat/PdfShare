const { createSlice, configureStore } = require("@reduxjs/toolkit");


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        isAdmin: false,
        token: null
    },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.token = action.payload                  // send a jwt token as action.payload 
        },
        logout(state) {
            state.isLoggedIn = false
            state.token = null
        },
    }
});

const store = configureStore({
    reducer: { auth: authSlice.reducer }
});

export const authActions = authSlice.actions;
export default store;