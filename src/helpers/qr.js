import dateHelper from './dateHelper.js'
import { Buffer } from 'buffer'

const {dateToQrAfip} = dateHelper

class AfipQR {
    data
    baseUrl
    encodedData
    url

    constructor(saleData){
        this.data = {
            ver: 1,
            fecha: dateToQrAfip(saleData.fechaEmision),
            cuit: parseInt(saleData.empresaCuit),
            ptoVta: parseInt(saleData.puntoVentaNumero),
            tipoCmp: parseInt(saleData.documentoCodigo),
            nroCmp: parseInt(saleData.numeroFactura),
            importe: saleData.total,
            moneda: 'PES',
            ctz: 1,
            tipoDocRec: parseInt(saleData.clienteDocumentoReceptor),
            nroDocRec: parseInt(saleData.clienteIdentificador),
            tipoCodAut: 'E',
            codAut: parseInt(saleData.cae),
        }
        this.baseUrl = 'https://www.afip.gob.ar/fe/qr/?p='
        this.encodedData = Buffer.from(JSON.stringify(this.data)).toString('base64')
        this.url = this.baseUrl + this.encodedData
    }
}

const qr = {
    AfipQR
}

export default qr