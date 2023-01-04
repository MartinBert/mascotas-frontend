import axios from 'axios'
// const soap = require('soap')

const checkStorageStatus = (err) => {
    if (err.status === 401 || err.status === 403) {
        localStorage.clear();
    }
}

const findLastVoucherNumber = async (cuit, salePointNumber, voucherCode) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_REST_AFIP}/obtenerUltimoNumeroAutorizado/${cuit}/${salePointNumber}/${voucherCode}`);
        return response.data.responseOfAfip;
    } catch (err) {
        checkStorageStatus(err);
        console.error(err);
    }
}

const generateVoucher = async (cuit, voucher) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_REST_AFIP}/generarComprobante/${cuit}`, voucher);
        return response.data;
    } catch (err) {
        checkStorageStatus(err);
        console.error(err);
    }
}

// const url = 'https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA4?WSDL'
// const args = {
//     token: '',
//     sign: '',
//     cuitRepresentada: '',
//     idPersona: ''
// }
// soap.createClient(url, {}, function (err, client) {
//     client.getPersona(args, function (err, result) {
//         console.log(result)
//     })
// })

const getMinimumBillingAmount = async () => {
    // This function continues to work even if AFIP changes the number of digits.
    try {
        const afipBiller = await axios.get('https://www.afip.gob.ar/facturador')
        const res = afipBiller.data.substr(afipBiller.data.indexOf('$'), 12)
        const validCharacter = '0123456789.,$'
        const minimumBillingAmount = (res.split('').filter(c => validCharacter.includes(c))).join('')
        return minimumBillingAmount
    } catch (err) {
        console.error(err)
    }
}

const marcas = {
    findLastVoucherNumber,
    generateVoucher,
    getMinimumBillingAmount
}

export default marcas;