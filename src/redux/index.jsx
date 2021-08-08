import { combineReducers } from 'redux';

import authReducer from './reducers/auth.jsx';

export default combineReducers({
    auth: authReducer,
})