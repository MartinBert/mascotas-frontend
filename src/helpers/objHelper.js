const existsProperty = (object = null, prop = null) => {
    if (!object || !prop) return
    const exists = Object.prototype.hasOwnProperty.call(object, prop)
    return exists // boolean
}

// Does not allow empty keys - 'true' is successful validation
const noEmptyKeys = (obj) => {
    const validation = !Object.values(obj).some(value => (value === ''))
    return validation
}

// ------------------- Sort array -------------------- //
const validateSort = (reversedKeysToCompare) => {
    let keysToCompare
    let validated
    if (!reversedKeysToCompare) keysToCompare = []
    else if (Array.isArray(reversedKeysToCompare)) keysToCompare = reversedKeysToCompare.reverse()
    else if (typeof reversedKeysToCompare === 'object') {
        const values = Object.values(reversedKeysToCompare)
        keysToCompare = values.reverse()
    } else keysToCompare = [reversedKeysToCompare]
    validated = keysToCompare.length === 0 ? false : true
    return { keysToCompare, validated }
}

const getTypeOfElements = (elements) => {
    const arrayOfElementsTypes = elements.map(element => typeof element)
    const [elementsTypes] = arrayOfElementsTypes.filter((item, index) => { return arrayOfElementsTypes.indexOf(item) === index })
    const arrayOfAreElementsArrays = elements.map(element => Array.isArray(element))
    const [areElementsArrays] = arrayOfAreElementsArrays.filter((item, index) => { return arrayOfAreElementsArrays.indexOf(item) === index })
    if (areElementsArrays) return 'array'
    else return elementsTypes
}

const sortArray = (elements, reversedKeysToCompare = null) => {
    const { keysToCompare, validated } = validateSort(reversedKeysToCompare)
    if (!validated) return elements
    const typeOfElements = getTypeOfElements(elements)
    if (!(typeof typeOfElements === 'string')) return elements

    if (typeOfElements === 'string') {
        const elementsWithLowerCaseInitial = elements.map(element => element.toLowerCase())
        return elementsWithLowerCaseInitial.sort()
    }
    const typesForLoopSort = ['array', 'object']
    if (typesForLoopSort.includes(typeOfElements)) {
        for (let index = 0; index < keysToCompare.length; index++) {
            const key = keysToCompare[index]
            elements.sort((a, b) => {
                if (a[key] > b[key]) return 1
                else if (a[key] < b[key]) return -1
                else return 0
            })
        }
    } else if (typeOfElements === 'number') elements.sort((a, b) => a - b)
    return elements
}

const spanishVoucherDataToSave = (data) => {
    const formattedData = {
        associatedVouchers: !data.associatedVouchers
            ? []
            : Array.isArray(data.associatedVouchers)
                ? data.associatedVouchers
                : [data.associatedVouchers],
        baseImponible10: parseFloat(data.ivaTaxBase10),
        baseImponible21: parseFloat(data.ivaTaxBase21),
        baseImponible27: parseFloat(data.ivaTaxBase27),
        buyers: !data.buyers
            ? []
            : Array.isArray(data.buyers)
                ? data.buyers
                : [data.buyers],
        cae: data.cae ? data.cae : null,
        cliente: data.client,
        clienteDireccion: data.clientAddress,
        clienteCondicionIva: data.clientIvaCondition,
        clienteDocumentoReceptor: parseInt(data.clientReceiverDocument),
        clienteIdentificador: data.clientIdentifier,
        clienteRazonSocial: data.clientName,
        condicionVenta: data.paymentPlanName[0],
        documento: data.fiscalNote._id,
        documentoCodigo: data.fiscalNote.codigoUnico,
        documentoFiscal: data.isFiscal,
        documentoLetra: data.fiscalNoteLetter,
        empresa: data.business,
        empresaCondicionIva: data.businessIvaCondition,
        empresaCuit: data.businessCuit,
        empresaDireccion: data.businessAddress,
        empresaIngresosBrutos: data.businessGrossIncomes,
        empresaInicioActividad: data.businessStartOfActivities,
        empresaLogo: data.businessLogo,
        empresaRazonSocial: data.businessName,
        fechaEmision: data.date,
        fechaEmisionString: data.dateString,
        importeIva: parseFloat(data.ivaTotal),
        indice: data.fiscalNoteNumber,
        iva: !data.iva
            ? []
            : Array.isArray(data.iva)
                ? data.iva
                : [data.iva],
        iva10: parseFloat(data.iva10),
        iva21: parseFloat(data.iva21),
        iva27: parseFloat(data.iva27),
        mediosPago: data.paymentMethod.map(method => method._id),
        mediosPagoNombres: Array.isArray(data.paymentMethodName) ? data.paymentMethodName : [data.paymentMethodName],
        numeroFactura: parseInt(data.fiscalNoteNumber),
        numeroCompletoFactura: data.fiscalNoteNumberComplete,
        optionals: !data.optionals
            ? []
            : Array.isArray(data.optionals)
                ? data.optionals
                : [data.optionals],
        planesPago: data.paymentPlan,
        planesPagoNombres: Array.isArray(data.paymentPlanName) ? data.paymentPlanName : [data.paymentPlanName],
        porcentajeDescuentoGlobal: data.discountGlobal ? parseFloat(data.discountGlobal) : 0,
        porcentajeRecargoGlobal: data.surchargeGlobal ? parseFloat(data.surchargeGlobal) : 0,
        productos: data.products ? data.products : [],
        profit: data.profit ? parseFloat(data.profit) : 0,
        puntoVenta: data.salePoint,
        puntoVentaNumero: parseInt(data.salePointNumber),
        puntoVentaNombre: data.salePointName,
        renglones: data.lines ? data.lines : [],
        subTotal: parseFloat(data.subAmount),
        taxes: !data.taxes
            ? []
            : Array.isArray(data.taxes)
                ? data.taxes
                : [data.taxes],
        total: parseFloat(data.amountNet),
        totalDescuento: data.discountTotal ? parseFloat(data.discountTotal) : 0,
        totalDiferencia: parseFloat(data.amountDifference),
        totalRecargo: data.surchargeTotal ? parseFloat(data.surchargeTotal) : 0,
        totalRedondeado: parseFloat(data.amountRounded),
        usuario: data.user._id,
        vencimientoCae: data.caeExpirationDate ? data.caeExpirationDate : null
    }
    return formattedData
}

const objHelper = {
    existsProperty,
    noEmptyKeys,
    sortArray,
    spanishVoucherDataToSave
}

export default objHelper