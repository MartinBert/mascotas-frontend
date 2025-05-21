import axios from 'axios'
import FormData from 'form-data'

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}

const deleteImage = async (id) => {
    const reqConfig = {
        headers: {
            Authorization: localStorage.getItem('token'), 'Content-Type': 'application/json',
            tenantid: localStorage.getItem('tenantId')
        }
    }
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/uploads/${id}`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const getImageUrl = async (id) => {
    const reqConfig = { 
        headers: {
            Authorization: localStorage.getItem('token'), 'Content-Type': 'application/json',
            tenantid: localStorage.getItem('tenantId')
        }
    }
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/uploads/${id}`, reqConfig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const uploadImage = async (data) => {
    const reqCofig = {
        headers: {
            Authorization: localStorage.getItem('token'),
            tenantid: localStorage.getItem('tenantId')
        }
    }
    const bodyMultiPart = new FormData()
    bodyMultiPart.append('file', data)
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/uploads`, bodyMultiPart, reqCofig)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const uploader = {
    deleteImage,
    getImageUrl,
    uploadImage
}

export default uploader