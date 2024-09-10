import axios from 'axios'

const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear()
    }
}

const deleteData = async() => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/seed`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const generateData = async() => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/seed`, {}, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const seed = {
    deleteData,
    generateData
}

export default seed