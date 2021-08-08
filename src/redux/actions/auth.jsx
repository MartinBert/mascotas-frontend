import { VERIFY_USER_AUTHENTICATION, GET_TOKEN } from '../types/auth';

export function getNewToken (credentials) {
    return (dispatch) => {
        dispatch( getToken(credentials) );
    }
}

export function verifyLoguedUser (token) {
    return (dispatch) => {
        dispatch( verifyUser(token) );
    }
}

const getToken = (credentials) => ({
    type: GET_TOKEN,
    payload: credentials
})

const verifyUser = (token) => ({
    type: VERIFY_USER_AUTHENTICATION,
    payload: token
})