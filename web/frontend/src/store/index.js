import { configureStore } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: true,
    showLogin: false,
    showNewFileForm: false,
    showForgotPasswordForm: false,
    searchFocus: false,
    file: null,
    counter: 0,
    showCounter: true,
    editFile: false
}

const authReducer = (state = initialState, action) => {

    if (action.type === 'login') {
        return {
            isLoggedIn: true,
            showLogin: false,
            showSignUp: false,
            showNewFileForm: false,
            showForgotPasswordForm: false,
            showFiles: true,
            searchFocus: false,
            editFile: false
        };
    }

    if (action.type === 'showLogin') {
        return {
            isLoggedIn: false,
            showLogin: true,
            showSignUp: false,
            showNewFileForm: false,
            showForgotPasswordForm: false,
            showFiles: false,
            searchFocus: false,
            editFile: false
        };
    }

    if (action.type === 'showSignup') {
        return {
            isLoggedIn: false,
            showLogin: false,
            showSignUp: true,
            showNewFileForm: false,
            showForgotPasswordForm: false,
            showFiles: false,
            searchFocus: false,
            accessToken: null,
            editFile: false
        };
    }

    if (action.type === 'showNewFileForm') {
        return {
            isLoggedIn: true,
            showLogin: false,
            showSignUp: false,
            showNewFileForm: true,
            showForgotPasswordForm: false,
            showFiles: false,
            searchFocus: false,
            editFile: false
        };
    }

    if (action.type === 'showForgotPasswordForm') {
        return {
            isLoggedIn: false,
            showLogin: false,
            showSignUp: false,
            showNewFileForm: false,
            showForgotPasswordForm: true,
            showFiles: false,
            searchFocus: false,
            editFile: false
        }
    }

    if (action.type === 'searchFocus') {
        return {
            isLoggedIn: true,
            showLogin: false,
            showSignUp: false,
            showNewFileForm: false,
            showForgotPasswordForm: false,
            showFiles: false,
            searchFocus: true,
            editFile: false
        }
    }

    if (action.type === 'edit-file') {
        return {
            isLoggedIn: true,
            showLogin: false,
            showSignUp: false,
            showNewFileForm: false,
            showForgotPasswordForm: false,
            showFiles: false,
            searchFocus: false,
            editFile: true
        }
    }

    if (action.type === 'close-edit-file') {
        return {
            isLoggedIn: true,
            showLogin: false,
            showSignUp: false,
            showNewFileForm: false,
            showForgotPasswordForm: false,
            showFiles: true,
            searchFocus: false,
            editFile: false
        }
    }
    
    return state;
}

const store = configureStore({ reducer: authReducer });

export default store;