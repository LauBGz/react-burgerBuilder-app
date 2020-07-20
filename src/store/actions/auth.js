import axios from 'axios';

import * as actionsTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionsTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    //We could also do this in auth action 
    return {
        type: actionsTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionsTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId');
    return {
        type: actionsTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
        ////expiresIn is a property from firebase in seconds but setTimeout works with ms
    };
};

export const auth = (email, password, isSignup) => {  
    return dispatch => {
        dispatch(authStart());
        //Firebase requirements
        //Endpoint https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
        //Body Payload: email password returnSecureToken (Should always be true).
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDfgC2NmQElml6Ozc1yGyXnjaZ9DhluPec';

        if(!isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDfgC2NmQElml6Ozc1yGyXnjaZ9DhluPec';
        };
        axios.post(url, authData)
        .then(response => {
            //We need to storage the token but also the time when expires
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', response.data.localId)
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn))
            //expiresIn is a property from firebase in seconds
        })
        .catch(error => {
            dispatch(authFail(error.response.data.error));
        })
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionsTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    return dispatch => {
        //We get the token from localStorage if exists
        const token = localStorage.getItem('token');
        if(!token){
            dispatch(logout());
        } else {
            //We turn the string into a date
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate <= new Date()){
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
            };            
        };
    };
};