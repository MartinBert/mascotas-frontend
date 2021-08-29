import { VERIFY_USER_AUTHENTICATION, GET_TOKEN } from '../types/auth';
import api from '../../services';

export function getNewToken (credentials) {
    return async(dispatch) => {
        const token = await api.auth.login(credentials);
        dispatch( getToken(token) );
    }
}

export function verifyLoguedUser (token) {
    return async (dispatch) => {
        const authorized = await api.auth.validateToken(token);
        console.log(authorized);
        dispatch( verifyUser(authorized) );
    }
}

const getToken = token => ({
    type: GET_TOKEN,
    payload: token
})

const verifyUser = authorizationStatus => ({
    type: VERIFY_USER_AUTHENTICATION,
    payload: authorizationStatus
})