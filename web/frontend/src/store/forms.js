const { createSlice, configureStore } = require("@reduxjs/toolkit");

const formsSlice = createSlice({
    name: 'form',
    initialState: {
        showNewFileForm: false,
        showSignUpForm: false,
        showForgotPasswordForm: false,
    },
    reducers: {
        showLoginForm(state) {
            state.showNewFileForm = false;
            state.showSignUpForm = false;
            state.showNewPasswordForm = false;
        },
        showSignUpForm(state) {
            state.showNewFileForm = false;
            state.showSignUpForm = true;
            state.showNewPasswordForm = false;
        },
        showForgotPasswordForm(state) {
            state.showNewFileForm = false;
            state.showSignUpForm = false;
            state.showForgotPasswordForm = true;
        }
    }
});

const store = configureStore({
    reducer: { forms: formsSlice.reducer }
});

export const formActions = formsSlice.actions;
export default store;