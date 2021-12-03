import axios from 'axios';

const login = async(userCredentials) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/auth`, userCredentials);
        return response.data;
    }catch(err){
        console.error(err);
    }
}

const validateToken = async(token) => {
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/checkToken/${token}`); 
        return response.data.authorized;
    }catch(err){
        console.error(err);
        return false;
    }
}

const auth = {
    login,
    validateToken
}

export default auth;