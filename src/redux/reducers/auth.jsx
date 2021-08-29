import { VERIFY_USER_AUTHENTICATION, GET_TOKEN } from '../types/auth';

const authStatus = { 
    token: null,
    authorizedUser: true,
    processing: false
};

export default function authReducer(state = authStatus, action){
    switch (action.type) {
        case GET_TOKEN:
            localStorage.setItem('token', action.payload);
            return { token: action.payload };
        case VERIFY_USER_AUTHENTICATION:
            return { 
                authorizedUser: action.payload,
                processing: false
            }
        default:
            return state;
    }
}
