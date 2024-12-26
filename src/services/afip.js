import axios from 'axios'

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear()
    }
}

const findLastVoucherNumber = async (cuit, salePointNumber, voucherCode) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST_AFIP}/obtenerUltimoNumeroAutorizado/${cuit}/${salePointNumber}/${voucherCode}`)
        return response.data.responseOfAfip
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const findTaxpayerData = async (userCuit, taxpayerCuit) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST_AFIP}/buscarDatosContribuyente/${userCuit}/${taxpayerCuit}`)
        return response.data
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const generateVoucher = async (cuit, voucher) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_REST_AFIP}/generarComprobante/${cuit}`, voucher)
        return response.data.responseOfAfip
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const getDocumentsTypes = async (cuit) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST_AFIP}/obtenerTiposDocumentos/${cuit}`)
        return response.data
    } catch (err) {
        console.error(err)
    }
}

// queryData = { salePointNumber, voucherNumber, voucherTypeNumber }
const getVoucherInfo = async (cuit, queryData) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_REST_AFIP}/obtenerDatosDelComprobante/${cuit}`, queryData)
        return response.data.responseOfAfip
    } catch (err) {
        checkStorageStatus(err)
        console.error(err)
    }
}

const afip = {
    findLastVoucherNumber,
    findTaxpayerData,
    generateVoucher,
    getDocumentsTypes,
    getVoucherInfo
}

export default afip