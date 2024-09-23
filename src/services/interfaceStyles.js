import axios from 'axios'

const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear()
    }
}


const edit = async(interfaceStyles) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/interfaceStyles/${interfaceStyles._id}`, interfaceStyles, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findAll = async () => {
    const headers = { headers: { Authorization: localStorage.getItem('token') } }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/interfaceStyles`, headers)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async(interfaceStyles) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/interfaceStyles`, interfaceStyles, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const interfaceStyles = {
    edit,
    findAll,
    save
}

export default interfaceStyles