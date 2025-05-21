// Custom Components
import { errorAlert } from './../components/alerts'

// Helpers
import dateHelper from './dateHelper.js'
import stringHelper from './stringHelper.js'

// Services
import api from '../services/index.js'

// Imports Destructuring
const { dateToAfip } = dateHelper
const { completeLengthWithZero } = stringHelper

let attemps = 0
const delay = ms => new Promise(result => setTimeout(result, ms))


const findNextVoucherNumber_fiscal = async (codigoUnico, empresaCuit, puntoVentaNumero) => {
    const lastVoucherNumber = await api.afip.findLastVoucherNumber(empresaCuit, puntoVentaNumero, codigoUnico)
    if (typeof lastVoucherNumber !== 'number') {
        if (attemps === 10) {
            return errorAlert(`
                No se pudo recuperar la correlación de AFIP del último comprobante emitido,
                intente de nuevo más tarde.
            `).then(() => window.location.reload())
        }
    } else {
        attemps = 0
        return lastVoucherNumber + 1
    }
    attemps++
    await delay(800)
    await findNextVoucherNumber_fiscal(codigoUnico, empresaCuit, puntoVentaNumero)
}

const findNextVoucherNumber_noFiscal = async (documentoCodigo) => {
    const lastVoucherNumber = await api.sales.findLastVoucherNumber(documentoCodigo)
    if (lastVoucherNumber.status !== 'OK') {
        if (attemps === 10) {
            return errorAlert(`
                No se pudo recuperar la correlación de AFIP del último comprobante emitido,
                intente de nuevo más tarde.
            `).then(() => window.location.reload())
        }
    } else {
        attemps = 0
        const lastNumber = lastVoucherNumber.data ?? 0
        return lastNumber + 1
    }
    attemps++
    await delay(800)
    await findNextVoucherNumber_noFiscal(documentoCodigo)
}

const fiscalVouchersCodes = [
    '001', /* Factura A */          { credit: '003', debit: '002' }, /* Notas fiscales asociadas a Factura A */
    '006', /* Factura B */          { credit: '008', debit: '007' }, /* Notas fiscales asociadas a Factura B */
    '011', /* Factura C */          { credit: '013', debit: '012' }, /* Notas fiscales asociadas a Factura C */
    '051', /* Factura M */          { credit: '053', debit: '052' }, /* Notas fiscales asociadas a Factura M */
    '081', /* Ticket Factura A */   { credit: '112', debit: '115' }, /* Notas fiscales asociadas a Ticket Factura A */
    '082', /* Ticket Factura B */   { credit: '113', debit: '116' }, /* Notas fiscales asociadas a Ticket Factura B */
    '083', /* Ticket */             { credit: '110', debit: null },  /* Notas fiscales asociadas a Ticket */
    '111', /* Ticket Factura C */   { credit: '114', debit: '117' }, /* Notas fiscales asociadas a Ticket Factura C */
    '118', /* Ticket Factura M */   { credit: '119', debit: '120' }  /* Notas fiscales asociadas a Ticket Factura M */

    // Más info en https://www.afip.gob.ar/fe/documentos/TABLACOMPROBANTES.xls
]

const creditCodes = fiscalVouchersCodes
    .filter(item => typeof item !== 'string')
    .map(code => code.credit)
    .filter(code => code !== null)

const debitCodes = fiscalVouchersCodes
    .filter(item => typeof item !== 'string')
    .map(code => code.debit)
    .filter(code => code !== null)

const fiscalNotesCodes = fiscalVouchersCodes
    .filter(item => typeof item !== 'string')
    .map(code => [code.credit, code.debit])
    .flat(1)
    .filter(code => code !== null)

const invoiceCodes = fiscalVouchersCodes
    .filter(item => typeof item === 'string')
    .filter(code => parseFloat(code) < 81)

const invoiceAndTicketCodes = fiscalVouchersCodes
    .filter(item => typeof item === 'string')

const ticketCodes = fiscalVouchersCodes
    .filter(item => typeof item === 'string')
    .filter(code => parseFloat(code) >= 81)

const formatBody = (saleData) => {
    const associatedVouchers = () => {
        if (!saleData.comprobantesAsociados) return []
        let associatedVouchers
        if (Array.isArray(saleData.associatedVouchers)) associatedVouchers = saleData.associatedVouchers
        else {
            associatedVouchers = [{
                Cuit: parseInt(saleData.comprobantesAsociados.Cuit), // (Opcional) Cuit del emisor del comprobante
                Nro: parseInt(saleData.comprobantesAsociados.Nro), // Numero de comprobante
                PtoVta: parseInt(saleData.comprobantesAsociados.PtoVta), // Punto de venta
                Tipo: parseInt(saleData.comprobantesAsociados.Tipo) // Tipo de comprobante (ver tipos disponibles)
            }]
        }
        return associatedVouchers
    }

    const buyers = () => {
        if (!saleData.compradores) return []
        let buyers
        if (Array.isArray(saleData.compradores)) buyers = saleData.compradores
        else {
            buyers = [{
                DocTipo: parseInt(saleData.compradores.DocTipo), // Tipo doc del comprador
                DocNro: parseInt(saleData.compradores.DocNro), // DNI del comprador
                Porcentaje: parseFloat(saleData.compradores.Porcentaje) // % de titularidad del comprador
            }]
        }
        return buyers
    }

    const existsIvaParams = (saleData) => {
        if (
            saleData.baseImponible10
            && saleData.baseImponible21
            && saleData.baseImponible27
            && saleData.iva10
            && saleData.iva21
            && saleData.iva27
        ) return true
        else return false
    }

    const iva = () => {
        if (!saleData.iva && !existsIvaParams(saleData)) return []
        let iva
        if (saleData.iva && Array.isArray(saleData.iva)) iva = saleData.iva
        else if (!saleData.iva && existsIvaParams(saleData)) {
            iva = [
                {
                    Id: 4, // Id del tipo de IVA (ver tipos disponibles) 
                    BaseImp: parseFloat(saleData.baseImponible10), // Base imponible
                    Importe: parseFloat(saleData.iva10) // Importe
                },
                {
                    Id: 5,
                    BaseImp: parseFloat(saleData.baseImponible21),
                    Importe: parseFloat(saleData.iva21)
                },
                {
                    Id: 6,
                    BaseImp: parseFloat(saleData.baseImponible27),
                    Importe: parseFloat(saleData.iva27)
                }
            ]
        } else iva = []
        return iva
    }

    const optionals = () => {
        if (!saleData.opcionales) return []
        let optionals
        if (Array.isArray(saleData.opcionales)) optionals = saleData.opcionales
        else {
            optionals = [{
                Id: saleData.opcionales.Id, // Codigo de tipo de opcion (ver tipos disponibles) 
                Valor: saleData.opcionales.Valor, // Valor 
            }]
        }
        return optionals
    }

    const taxes = () => {
        if (!saleData.tributos) return []
        let taxes
        if (Array.isArray(saleData.tributos)) taxes = saleData.tributos
        else {
            taxes = [{
                Id: parseInt(saleData.tributos.Id), // Id del tipo de tributo (ver tipos disponibles) 
                Desc: saleData.tributos.Desc, // (Opcional) Descripcion
                BaseImp: parseFloat(saleData.tributos.BaseImp), // Base imponible para el tributo
                Alic: parseFloat(saleData.tributos.Alic), // Alícuota
                Importe: parseFloat(saleData.tributos.Importe), // Importe del tributo
            }]
        }
        return taxes
    }

    const body = {
        CantReg: 1, // Cantidad de comprobantes a registrar
        CbteDesde: parseInt(saleData.numeroFactura), // Numero de comprobante o numero del primer comprobante en caso de ser mas de uno
        CbteFch: parseInt(dateToAfip(saleData.fechaEmision)), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
        CbteHasta: parseInt(saleData.numeroFactura), // Numero de comprobante o numero del ultimo comprobante en caso de ser mas de uno
        CbteTipo: parseInt(saleData.documentoCodigo), // Tipo de comprobante (ver tipos disponibles)
        Concepto: 1, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
        CondicionIVAReceptorId: parseInt(saleData.receiverIvaCondition), // A partir de 2025
        DocNro: parseInt(saleData.clienteIdentificador), // Numero de documento del comprador
        DocTipo: parseInt(saleData.clienteDocumentoReceptor), // Tipo de documento del comprador (ver tipos disponibles)
        ImpIVA: parseInt(saleData.importeIva), //Importe total de IVA
        ImpNeto: parseInt(saleData.subTotal), // Importe neto gravado
        ImpOpEx: 0, // Importe exento de IVA
        ImpTotal: parseInt(saleData.total), // Importe total del comprobante
        ImpTotConc: 0, // Importe neto no gravado
        ImpTrib: 0, //Importe total de tributos
        MonId: 'PES', //Tipo de moneda usada en el comprobante (ver tipos disponibles)(PES para pesos argentinos)
        MonCotiz: 1, // Cotización de la moneda usada (1 para pesos argentinos)
        PtoVta: parseInt(saleData.puntoVentaNumero), // Punto de venta

        // OPCIONALES
        CbtesAsoc: associatedVouchers(), // Comprobante asociado (Factura, etc.) para solicitar notas de débito o crédito
        Compradores: buyers(),
        Iva: iva(),
        Opcionales: optionals(),
        Tributos: taxes()
    }

    if (!saleData.comprobantesAsociados) delete (body.CbtesAsoc)
    if (!saleData.compradores) delete (body.Compradores)
    if (iva().length === 0 || saleData.documentoLetra === 'C') delete (body.Iva)
    if (!saleData.opcionales) delete (body.Opcionales)
    if (!saleData.tributos) delete (body.Tributos)

    return body
}

const formatToCompleteVoucherNumber = (salePoint, voucherNumber) => {
    const completeNumber =
        completeLengthWithZero(salePoint, 4)
        + '-'
        + completeLengthWithZero(voucherNumber, 8)
    return completeNumber
}

const getReferenceVoucher = (state) => {
    const voucher = state.params.referenceVoucher
    return voucher
}

const afipHelper = {
    creditCodes,
    debitCodes,
    findNextVoucherNumber_fiscal,
    findNextVoucherNumber_noFiscal,
    fiscalNotesCodes,
    fiscalVouchersCodes,
    formatBody,
    formatToCompleteVoucherNumber,
    getReferenceVoucher,
    invoiceCodes,
    invoiceAndTicketCodes,
    ticketCodes
}

export default afipHelper