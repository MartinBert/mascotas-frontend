import axios from 'axios'
import mathHelper from '../helpers/mathHelper'

const { roundTwoDecimals } = mathHelper
const checkStorageStatus = (err) => {
    if(err.status === 401 || err.status === 403){
        localStorage.clear()
    }
}


const findAll = async(params) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    const {page, limit, filters} = params
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/productos?page=${page}&limit=${limit}&filters=${filters}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findById = async(id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/productos/${id}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const findMultipleIds = async(ids) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/mediospago/multiple/idList?ids=${JSON.stringify(ids)}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const getByBarcode = async(barcode) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.get(`${process.env.REACT_APP_API_REST}/productos/barcode/${barcode}`, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const deleteById = async(id) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API_REST}/productos/${id}`, headers)
        return response
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const save = async(producto) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.post(`${process.env.REACT_APP_API_REST}/productos`, producto, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const edit = async(producto) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/productos`, producto, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
}

const modifyStock = async(body) => {
    const headers = {headers: {Authorization: localStorage.getItem('token')}}
    if (!body) return
    
    const productWithRoundedStock = {
        ...body,
        product: {
            ...body.product,
            cantidadStock: roundTwoDecimals(body.product.cantidadStock),
            cantidadFraccionadaStock: roundTwoDecimals(body.product.cantidadFraccionadaStock)
        }
    }
    try{
        const response = await axios.put(`${process.env.REACT_APP_API_REST}/productos/modifyStock`, productWithRoundedStock, headers)
        return response.data
    }catch(err){
        checkStorageStatus(err)
        console.error(err)
    }
} 

const productos = {
    findAll,
    findById,
    findMultipleIds,
    getByBarcode,
    deleteById,
    save,
    edit,
    modifyStock
}

export default productos