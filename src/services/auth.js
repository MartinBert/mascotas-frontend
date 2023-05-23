import axios from 'axios'

const login = async(userCredentials) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/auth`, userCredentials)
        return response.data
    }catch(err){
        console.error(err)
    }
}

const auth = {
    login
}

export default auth