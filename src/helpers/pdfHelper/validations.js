// Helpers
import dateHelper from '../dateHelper'
import objHelper from '../objHelper'

// Services
import api from '../../services'

// Imports Destructuring
const { afipDateToLocalFormat } = dateHelper
const { existsProperty } = objHelper


const existIva = (data) => {
    const iva10 = existsProperty(data, 'iva10') ? data.iva10 : 0
    const iva21 = existsProperty(data, 'iva21') ? data.iva21 : 0
    const iva27 = existsProperty(data, 'iva27') ? data.iva27 : 0
    const totalIva = iva10 + iva21 + iva27
    if (totalIva === 0) return false
    else return true
}

const getAssociatedData = async (fiscalData, getType = null) => {
    const associatedVoucher = fiscalData.associatedVouchers[0]
    let associatedData = {}

    // Associated document data
    const findAssociatedDocument = await api.documents.findAllByFilters({ codigoUnico: associatedVoucher.Tipo })
    const associatedDocument = findAssociatedDocument.data.docs[0]
    associatedData.voucherLetter = associatedDocument.letra
    associatedData.voucherName = associatedDocument.nombre

    // Associated voucher data
    const queryAssociatedData = {
        salePointNumber: associatedVoucher.PtoVta,
        voucherNumber: associatedVoucher.Nro,
        voucherTypeNumber: associatedVoucher.Tipo
    }
    const associatedVoucherData = await api.afip.getVoucherInfo(associatedVoucher.Cuit, queryAssociatedData)
    associatedData.voucherDate = afipDateToLocalFormat(associatedVoucherData.CbteFch)

    if (getType === 'print') {
        // Voucher data
        const queryData = {
            salePointNumber: fiscalData.puntoVentaNumero,
            voucherNumber: fiscalData.numeroFactura,
            voucherTypeNumber: parseFloat(fiscalData.documentoCodigo)
        }
        const voucherData = await api.afip.getVoucherInfo(fiscalData.empresaCuit, queryData)
        associatedData.voucherCae = voucherData.CodAutorizacion
        associatedData.voucherCaeExpiration = afipDateToLocalFormat(voucherData.FchVto)
    }

    return associatedData
}


const validations = {
    existIva,
    getAssociatedData
}

export default validations