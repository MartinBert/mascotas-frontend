import api from '../../services'
import { VERIFY_USER_AUTHENTICATION, GET_TOKEN } from '../types/auth';

const authStatus = { 
    token: null,
    authorizedUser: false
};

export default function authReducer(state = authStatus, action){
    switch (action.type) {
        case GET_TOKEN:
            const processedToken = api.auth.login(action.payload);
            return { token: processedToken };
        case VERIFY_USER_AUTHENTICATION:
            const checkedUser = api.auth.validateToken(action.payload);
            return { authorizedUser: checkedUser }
        default:
            return state;
    }
}
