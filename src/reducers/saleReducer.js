import helpers from '../helpers'

const { decimalPercent, roundTwoDecimals, previousInteger } = helpers.mathHelper
const { simpleDateWithHours } = helpers.dateHelper
const { completeLengthWithZero } = helpers.stringHelper

const initialState = {
    //----------------------------------------------- Generics state of view -----------------------------------------------------------/
    discountSurchargeModalVisible: false,
    discountSurchargeModalOperation: 'discount',
    finalizeSaleModalIsVisible: false,
    loadingView: false,
    loadingDocumentIndex: false,

    //------------------------------------------------- State of sale data -------------------------------------------------------------/
    indice: null,
    usuario: null,
    productos: [],
    renglones: [],
    documento: null,
    documentoLetra: null,
    documentoFiscal: null,
    documentoCodigo: null,
    empresa: null,
    empresaRazonSocial: null,
    empresaDireccion: null,
    empresaCondicionIva: null,
    empresaCuit: null,
    empresaIngresosBrutos: null,
    empresaInicioActividad: null,
    empresaLogo: null,
    puntoVenta: null,
    puntoVentaNumero: null,
    puntoVentaNombre: null,
    numeroFactura: null,
    numeroCompletoFactura: null,
    condicionVenta: 'Contado',
    cliente: null,
    clienteRazonSocial: null,
    clienteDireccion: null,
    clienteIdentificador: null,
    clienteCondicionIva: null,
    clienteDocumentoReceptor: null,
    mediosPago: [],
    mediosPagoNombres: [],
    planesPagoToSelect: [],
    planesPago: [],
    planesPagoNombres: [],
    fechaEmision: new Date(),
    fechaEmisionString: simpleDateWithHours(new Date()),
    cae: null,
    vencimientoCae: null,
    porcentajeRecargoGlobal: 0,
    porcentajeDescuentoGlobal: 0,
    totalDescuento: 0,
    totalRecargo: 0,
    iva21: 0,
    iva10: 0,
    iva27: 0,
    baseImponible21: 0,
    baseImponible10: 0,
    baseImponible27: 0,
    importeIva: 0,
    subTotal: 0,
    total: 0,
    closedSale: false
}

const actions = {
    //---------------------------------------------- Generics actions of view ----------------------------------------------------------/
    SHOW_DISCOUNT_SURCHARGE_MODAL: 'SHOW_DISCOUNT_SURCHARGE_MODAL',
    HIDE_DISCOUNT_SURCHARGE_MODAL: 'HIDE_DISCOUNT_SURCHARGE_MODAL',
    SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION: 'SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION',
    SHOW_FINALIZE_SALE_MODAL: 'SHOW_FINALIZE_SALE_MODAL',
    HIDE_FINALIZE_SALE_MODAL: 'HIDE_FINALIZE_SALE_MODAL',
    CLOSE_FISCAL_OPERATION: 'CLOSE_FISCAL_OPERATION',
    CLOSE_NO_FISCAL_OPERATION: 'CLOSE_NO_FISCAL_OPERATION',
    LOADING_DOCUMENT_INDEX: 'LOADING_DOCUMENT_INDEX',
    LOADING_VIEW: 'LOADING_VIEW',
    RESET_STATE: 'RESET_STATE',

    //------------------------------------------------ Actions of sale data ------------------------------------------------------------/
    SET_INDEX: 'SET_INDEX',
    SET_USER: 'SET_USER',
    SET_GLOBAL_DISCOUNT_PERCENT: 'SET_GLOBAL_DISCOUNT_PERCENT',
    SET_GLOBAL_SURCHARGE_PERCENT: 'SET_GLOBAL_SURCHARGE_PERCENT',
    SET_PRODUCTS: 'SET_PRODUCTS',
    SET_LINES: 'SET_LINES',
    SET_FRACTIONED: 'SET_FRACTIONED',
    SET_LINE_QUANTITY: 'SET_LINE_QUANTITY',
    SET_NET_PRICE: 'SET_NET_PRICE',
    SET_NET_PRICE_FIXED: 'SET_NET_PRICE_FIXED',
    SET_LINE_DISCOUNT_PERCENT: 'SET_LINE_DISCOUNT_PERCENT',
    SET_LINE_SURCHARGE_PERCENT: 'SET_LINE_SURCHARGE_PERCENT',
    SET_CLIENT: 'SET_CLIENT',
    SET_DOCUMENT: 'SET_DOCUMENT',
    SET_PAYMENT_METHODS: 'SET_PAYMENT_METHODS',
    SET_PAYMENT_PLANS: 'SET_PAYMENT_PLANS',
    SET_COMPANY: 'SET_COMPANY',
    SET_SALE_POINT: 'SET_SALE_POINT',
    SET_DATES: 'SET_DATES',
    SET_VOUCHER_NUMBERS: 'SET_VOUCHER_NUMBERS',
    SET_TOTAL: 'SET_TOTAL',
}

const calculateGrossPrice = (line) => {
    const quantity = (line.fraccionar)
        ? line.cantidadUnidades / line.fraccionamiento
        : line.cantidadUnidades
    const grossPrice = quantity * line.precioUnitario
    return grossPrice
}

const calculateLineSurcharge = (line, recargoGlobal, porcentajePlanDePago) => {
    const percentagePaymentPlan = (porcentajePlanDePago > 0) ? porcentajePlanDePago : 0
    const grossPrice = calculateGrossPrice(line)
    let lineSurcharge = 0
    if (line.precioNetoFijo) lineSurcharge = (line.precioNeto > grossPrice) ? line.precioNeto - grossPrice : 0
    else {
        const netPrice = grossPrice * (1
            + decimalPercent(line.porcentajeRecargoRenglon)
            + decimalPercent(recargoGlobal)
            + percentagePaymentPlan
        )
        lineSurcharge = netPrice - grossPrice
    }
    return roundTwoDecimals(lineSurcharge)
}

const calculateLineDiscount = (line, descuentoGlobal, porcentajePlanDePago) => {
    const percentagePaymentPlan = (porcentajePlanDePago < 0) ? porcentajePlanDePago : 0
    const grossPrice = calculateGrossPrice(line)
    let lineDiscount = 0
    if (line.precioNetoFijo) lineDiscount = (grossPrice > line.precioNeto) ? grossPrice - line.precioNeto : 0
    else {
        const netPrice = grossPrice * (1
            - decimalPercent(line.porcentajeDescuentoRenglon)
            - decimalPercent(descuentoGlobal)
            + percentagePaymentPlan
        )
        lineDiscount = grossPrice - netPrice
    }
    return roundTwoDecimals(lineDiscount)
}

const calculateNetPrice = (line, recargoGlobal, descuentoGlobal, porcentajePlanDePago) => {
    const grossPrice = calculateGrossPrice(line)
    const netPrice = grossPrice
        + calculateLineSurcharge(line, recargoGlobal, porcentajePlanDePago)
        - calculateLineDiscount(line, descuentoGlobal, porcentajePlanDePago)
    return roundTwoDecimals(netPrice)
}

const calculateQuantity = (line, recargoGlobal, descuentoGlobal, porcentajePlanDePago) => {
    const initialQuantity = (line.fraccionar)
        ? (line.precioNeto / line.precioUnitario) * line.fraccionamiento
        : line.precioNeto / line.precioUnitario
    const quantity = initialQuantity * (1
        - decimalPercent(line.porcentajeRecargoRenglon)
        - decimalPercent(recargoGlobal)
        + decimalPercent(line.porcentajeDescuentoRenglon)
        + decimalPercent(descuentoGlobal)
        + porcentajePlanDePago
    )

    const removedQuantity = (line.porcentajeRecargoRenglon > 0 || recargoGlobal > 0 || porcentajePlanDePago > 0)
        ? initialQuantity - quantity
        : 0
    line.cantidadQuitadaPorRecargo_enKg = (line.fraccionar)
        ? removedQuantity / line.fraccionamiento
        : removedQuantity

    const addedQuantity = (line.porcentajeDescuentoRenglon > 0 || descuentoGlobal > 0 || porcentajePlanDePago < 0)
        ? quantity - initialQuantity
        : 0
    line.cantidadAgregadaPorDescuento_enKg = (line.fraccionar)
        ? addedQuantity / line.fraccionamiento
        : addedQuantity

    return quantity
}

const spanQuantity = (line) => {
    const unitMeasure_gramsToGrams = (!line.unidadMedida)
        ? false
        : (
            !(((line.unidadMedida).toLowerCase()).includes('kilo'))
            && ((line.unidadMedida).toLowerCase()).includes(' gramo')
        )
            ? true
            : false

    if (line.fraccionar) {
        if (line.fraccionamiento < 1000) {
            if (unitMeasure_gramsToGrams) {
                line.cantidadKg = previousInteger(line.cantidadUnidades / 1000)
                line.cantidadg = line.cantidadUnidades % 1000
            } else {
                line.cantidadKg = previousInteger(line.cantidadUnidades)
                line.cantidadg = 0
            }
        } else {
            line.cantidadKg = previousInteger(line.cantidadUnidades / 1000)
            line.cantidadg = line.cantidadUnidades % 1000
        }

    } else {
        if (line.fraccionamiento < 1000) {
            if (unitMeasure_gramsToGrams) {
                const remainder = (line.cantidadUnidades % 1000)
                line.cantidadKg = previousInteger(line.cantidadUnidades * line.fraccionamiento / 1000)
                line.cantidadg = remainder * line.fraccionamiento % 1000
            } else {
                const remainder = line.cantidadUnidades * line.fraccionamiento - previousInteger(line.cantidadUnidades * line.fraccionamiento)
                line.cantidadKg = previousInteger(line.cantidadUnidades * line.fraccionamiento)
                line.cantidadg = remainder * 1000
            }
        } else {
            line.cantidadKg = previousInteger(line.cantidadUnidades)
            line.cantidadg = (line.cantidadUnidades - previousInteger(line.cantidadUnidades)) * 1000
        }
    }
}

const updateValues = (line, recargoGlobal, descuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice) => {
    if (line.precioNetoFijo) {
        line.precioUnitario = (line.fraccionar) ? productFractionedPrice : productUnfractionedPrice
        line.cantidadUnidades = calculateQuantity(line, recargoGlobal, descuentoGlobal, porcentajePlanDePago)
        line.precioBruto = calculateGrossPrice(line)
    } else {
        line.precioUnitario = (line.fraccionar) ? productFractionedPrice : productUnfractionedPrice
        line.precioBruto = calculateGrossPrice(line)
        line.precioNeto = calculateNetPrice(line, recargoGlobal, descuentoGlobal, porcentajePlanDePago)
    }
    line.recargo = calculateLineSurcharge(line, recargoGlobal, porcentajePlanDePago)
    line.descuento = calculateLineDiscount(line, descuentoGlobal, porcentajePlanDePago)
    spanQuantity(line)
    return line
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        //-------------------------------------------- Generic reducers of view -------------------------------------------------------/
        case actions.SHOW_DISCOUNT_SURCHARGE_MODAL:
            return {
                ...state,
                discountSurchargeModalVisible: true,
            }
        case actions.HIDE_DISCOUNT_SURCHARGE_MODAL:
            return {
                ...state,
                discountSurchargeModalVisible: false,
            }
        case actions.SET_GLOBAL_DISCOUNT_SURCHARGE_OPERATION:
            const refreshLinesValues = (percentageType, productos) => {
                const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
                let lines = []
                if (percentageType === 'surcharge') {
                    lines = state.renglones.map((line) => {
                        const productUnfractionedPrice = productos.find(product => product._id === line._id).precioVenta
                        const productFractionedPrice = productos.find(product => product._id === line._id).precioVentaFraccionado
                        updateValues(line, state.porcentajeRecargoGlobal, 0, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
                        return line
                    })
                } else {
                    lines = state.renglones.map((line) => {
                        const productUnfractionedPrice = productos.find(product => product._id === line._id).precioVenta
                        const productFractionedPrice = productos.find(product => product._id === line._id).precioVentaFraccionado
                        updateValues(line, 0, state.porcentajeDescuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
                        return line
                    })
                }
                return lines
            }
            return {
                ...state,
                renglones: refreshLinesValues(action.payload, state.productos),
                discountSurchargeModalOperation: action.payload,
            }
        case actions.SHOW_FINALIZE_SALE_MODAL:
            return {
                ...state,
                finalizeSaleModalIsVisible: true
            }
        case actions.HIDE_FINALIZE_SALE_MODAL:
            return {
                ...state,
                finalizeSaleModalIsVisible: false
            }
        case actions.CLOSE_FISCAL_OPERATION:
            return {
                ...state,
                cae: action.payload.CAE,
                vencimientoCae: action.payload.CAEFchVto,
                closedSale: true
            }
        case actions.CLOSE_NO_FISCAL_OPERATION:
            return {
                ...state,
                closedSale: true
            }
        case actions.LOADING_DOCUMENT_INDEX:
            return {
                ...state,
                loadingDocumentIndex: !state.loadingDocumentIndex
            }
        case actions.LOADING_VIEW:
            return {
                ...state,
                loadingView: !state.loadingView
            }

        //--------------------------------------------- Reducers of sale data -------------------------------------------------------/
        case actions.SET_INDEX:
            return {
                ...state,
                indice: action.payload
            }
        case actions.SET_USER:
            return {
                ...state,
                usuario: action.payload
            }
        case actions.SET_GLOBAL_DISCOUNT_PERCENT:
            return {
                ...state,
                porcentajeDescuentoGlobal: action.payload,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    const newLine = updateValues(line, 0, action.payload, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
                    return newLine
                }),
            }
        case actions.SET_GLOBAL_SURCHARGE_PERCENT:
            return {
                ...state,
                porcentajeRecargoGlobal: action.payload,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    updateValues(line, action.payload, 0, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
                    return line
                }),
            }
        case actions.SET_LINE_QUANTITY:
            return {
                ...state,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    if (line._id === action.payload._id) {
                        line.cantidadUnidades = action.payload.cantidadUnidades
                        updateValues(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
                    }
                    return line
                }),
            }
        case actions.SET_NET_PRICE:
            return {
                ...state,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    if (line._id === action.payload._id) {
                        line.precioNeto = action.payload.precioNeto
                        line.precioUnitario = (line.fraccionar) ? productFractionedPrice : productUnfractionedPrice
                        line.cantidadUnidades = calculateQuantity(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago)
                        line.precioBruto = calculateGrossPrice(line)
                        spanQuantity(line)
                    }
                    return line
                }),
            }
        case actions.SET_NET_PRICE_FIXED:
            return {
                ...state,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    if (line._id === action.payload._id) {
                        line.precioNetoFijo = action.payload.precioNetoFijo
                        updateValues(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
                    }
                    return line
                })
            }
        case actions.SET_LINE_DISCOUNT_PERCENT:
            return {
                ...state,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    if (line._id === action.payload._id) {
                        line.porcentajeDescuentoRenglon = action.payload.porcentajeDescuentoRenglon
                        updateValues(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
                    }
                    return line
                }),
            }
        case actions.SET_LINE_SURCHARGE_PERCENT:
            return {
                ...state,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    if (line._id === action.payload._id) {
                        line.porcentajeRecargoRenglon = action.payload.porcentajeRecargoRenglon
                        updateValues(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
                    }
                    return line
                }),
            }
        case actions.SET_LINES:
            return {
                ...state,
                renglones: action.payload.map((product) => {
                    const unitMeasure_gramsToGrams = (!product.unidadMedida)
                        ? false
                        : (!(((product.unidadMedida.nombre).toLowerCase()).includes('kilo'))
                            && ((product.unidadMedida.nombre).toLowerCase()).includes(' gramo'))
                            ? true
                            : false
                    const fractionament = (!product.unidadMedida)
                        ? 1
                        : product.unidadMedida.fraccionamiento
                    const productUnitOfMeasure = (!product.unidadMedida)
                        ? null
                        : action.payload.find(item => item._id === product._id).unidadMedida.nombre

                    const linePresent = state.renglones.find(renglon => renglon._id === product._id)
                    if (linePresent) return linePresent

                    const formatProduct = {
                        _id: product._id,
                        nombre: product.nombre,
                        codigoBarras: product.codigoBarras,
                        unidadMedida: productUnitOfMeasure,
                        precioUnitario: product.precioVenta,
                        porcentajeIva: (product.porcentajeIvaVenta) ? product.porcentajeIvaVenta : 0,
                        importeIva: (product.ivaVenta) ? product.ivaVenta : 0,
                        fraccionamiento: fractionament,
                        fraccionar: false,
                        cantidadUnidades: 1,
                        cantidadQuitadaPorRecargo_enKg: 0,
                        cantidadAgregadaPorDescuento_enKg: 0,
                        cantidadKg: unitMeasure_gramsToGrams ? 0 : (fractionament < 1000) ? fractionament : 1,
                        cantidadg: unitMeasure_gramsToGrams ? fractionament : 0,
                        porcentajeRecargoRenglon: 0,
                        porcentajeDescuentoRenglon: 0,
                        recargo: 0,
                        descuento: 0,
                        precioNeto: product.precioVenta,
                        precioNetoFijo: false,
                        precioBruto: product.precioVenta
                    }

                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
                    const productUnfractionedPrice = formatProduct.precioUnitario
                    const productFractionedPrice = formatProduct.precioUnitario
                    updateValues(formatProduct, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)

                    return formatProduct
                })
            }
        case actions.SET_FRACTIONED:
            return {
                ...state,
                renglones: state.renglones.map(line => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    if (line._id === action.payload._id) {
                        line.fraccionar = action.payload.fraccionar
                        if (line.fraccionar === false) line.cantidadUnidades = 1
                        updateValues(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
                    }
                    return line
                })
            }
        case actions.SET_PRODUCTS:
            return {
                ...state,
                productos: action.payload,
            }
        case actions.SET_CLIENT:
            if (!action.payload) {
                return {
                    ...state,
                    cliente: null,
                    clienteRazonSocial: null,
                    clienteDireccion: null,
                    clienteIdentificador: null,
                    clienteCondicionIva: null,
                    clienteDocumentoReceptor: null
                }
            } else {
                return {
                    ...state,
                    cliente: action.payload,
                    clienteRazonSocial: action.payload.razonSocial,
                    clienteDireccion: action.payload.direccion,
                    clienteIdentificador: action.payload.cuit,
                    clienteCondicionIva: action.payload.condicionFiscal.nombre,
                    clienteDocumentoReceptor: action.payload.documentoReceptor
                }
            }
        case actions.SET_DOCUMENT:
            if (!action.payload) {
                return {
                    ...state,
                    documento: null,
                    documentoLetra: null,
                    documentoFiscal: null,
                    documentoCodigo: null,
                    documentoDocumentoReceptor: null
                }
            } else {
                return {
                    ...state,
                    documento: action.payload,
                    documentoLetra: action.payload.letra,
                    documentoFiscal: action.payload.fiscal,
                    documentoCodigo: action.payload.codigoUnico,
                    documentoDocumentoReceptor: action.payload.documentoReceptor
                }
            }
        case actions.SET_COMPANY:
            return {
                ...state,
                empresa: action.payload,
                empresaRazonSocial: action.payload.razonSocial,
                empresaDireccion: action.payload.direccion,
                empresaCondicionIva: action.payload.condicionFiscal ? action.payload.condicionFiscal.nombre : null,
                empresaCuit: action.payload.cuit,
                empresaIngresosBrutos: action.payload.ingresosBrutos,
                empresaInicioActividad: action.payload.fechaInicioActividad,
                empresaLogo: action.payload.logo ? action.payload.logo.url : null
            }
        case actions.SET_SALE_POINT:
            return {
                ...state,
                puntoVenta: action.payload,
                puntoVentaNumero: action.payload.numero,
                puntoVentaNombre: action.payload.nombre,
            }
        case actions.SET_DATES:
            return {
                ...state,
                fechaEmision: action.payload,
                fechaEmisionString: simpleDateWithHours(action.payload)
            }
        case actions.SET_VOUCHER_NUMBERS:
            return {
                ...state,
                numeroFactura: action.payload,
                numeroCompletoFactura:
                    completeLengthWithZero(state.puntoVentaNumero, 4) +
                    '-' +
                    completeLengthWithZero(action.payload, 8),
            }
        case actions.SET_PAYMENT_METHODS:
            if (!action.payload) {
                return {
                    ...state,
                    mediosPago: [],
                    mediosPagoNombres: [],
                    planesPagoToSelect: [],
                }
            } else {
                const paymentMethodNames = [action.payload.data].map(paymentMethod => paymentMethod.nombre)
                const paymentPlansMapping = [action.payload.data].map(paymentMethod => paymentMethod.planes)
                const paymentPlans = []
                paymentPlansMapping.forEach(paymentPlanMapping => {
                    paymentPlanMapping.forEach(plan => {
                        paymentPlans.push(plan)
                    })
                })
                return {
                    ...state,
                    mediosPago: [action.payload.data],
                    mediosPagoNombres: paymentMethodNames,
                    planesPagoToSelect: paymentPlans,
                }
            }
        case actions.SET_PAYMENT_PLANS:
            if (!action.payload) {
                return {
                    ...state,
                    planesPago: [],
                    planesPagoNombres: [],
                    renglones: state.renglones.map(line => {
                        const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                        const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                        updateValues(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, 0, productUnfractionedPrice, productFractionedPrice)
                        return line
                    })
                }
            } else {
                const plans = action.payload.map(item => JSON.parse(item))
                const planNames = plans.map(item => item.nombre)
                const porcentajePlanDePagoSeleccionado = (action.payload.length > 0) ? decimalPercent((JSON.parse(action.payload[0])).porcentaje) : 0
                return {
                    ...state,
                    planesPago: plans,
                    planesPagoNombres: planNames,
                    renglones: state.renglones.map(line => {
                        const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                        const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                        updateValues(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePagoSeleccionado, productUnfractionedPrice, productFractionedPrice)
                        return line
                    })
                }
            }
        case actions.SET_TOTAL:
            if (state.renglones.length === 0) {
                state.totalDescuento = 0
                state.totalRecargo = 0
                state.baseImponible21 = 0
                state.baseImponible10 = 0
                state.baseImponible27 = 0
                state.iva21 = 0
                state.iva10 = 0
                state.iva27 = 0
                state.importeIva = 0
                state.subTotal = 0
                state.total = 0
                return state
            }

            // ---------------- Cálculos correspondientes a ítems de precio VARIABLE ---------------- //
            const variableAmountLines = state.renglones.filter(renglon => renglon.precioNetoFijo === false)
            const variableLinesSumBasePrice = variableAmountLines.reduce((acc, el) => acc + el.precioNeto, 0)
            const totalDescuentoVariable = roundTwoDecimals(variableAmountLines.reduce((acc, el) => acc + el.descuento, 0))
            const totalRecargoVariable = roundTwoDecimals(variableAmountLines.reduce((acc, el) => acc + el.recargo, 0))

            // ---------------- Cálculos correspondientes a ítems de precio FIJADO ---------------- //
            const fixedAmountLines = state.renglones.filter(renglon => renglon.precioNetoFijo === true)
            const fixedLinesSumBasePrice = fixedAmountLines.reduce((acc, el) => acc + el.precioNeto, 0)
            const totalDescuentoFijo = roundTwoDecimals(fixedAmountLines.reduce((acc, el) => acc + el.descuento, 0))
            const totalRecargoFijo = roundTwoDecimals(fixedAmountLines.reduce((acc, el) => acc + el.recargo, 0))

            // ---------------- TOTALES (ítems de precio VARIABLE + ítems de precio FIJADO) ---------------- //
            const totalLinesSum = variableLinesSumBasePrice + fixedLinesSumBasePrice
            const totalRecargo = totalRecargoVariable + totalRecargoFijo
            const totalDescuento = totalDescuentoVariable + totalDescuentoFijo

            // ---------------- Cálculo de IVA, total y subtotal de la factura ---------------- //
            const iva21productosMontoVariable = variableAmountLines.filter(renglon => renglon.porcentajeIva === 21)
            const iva21productosMontoFijo = fixedAmountLines.filter(renglon => renglon.porcentajeIva === 21)
            const iva10productosMontoVariable = variableAmountLines.filter(renglon => renglon.porcentajeIva === 10.5)
            const iva10productosMontoFijo = fixedAmountLines.filter(renglon => renglon.porcentajeIva === 10.5)
            const iva27productosMontoVariable = variableAmountLines.filter(renglon => renglon.porcentajeIva === 27)
            const iva27productosMontoFijo = fixedAmountLines.filter(renglon => renglon.porcentajeIva === 27)
            const iva21Total = roundTwoDecimals(
                iva21productosMontoVariable.reduce((acc, el) => acc + el.precioNeto, 0)
                + iva21productosMontoFijo.reduce((acc, el) => acc + el.precioNeto, 0)
            )
            const iva10Total = roundTwoDecimals(
                iva10productosMontoVariable.reduce((acc, el) => acc + el.precioNeto, 0)
                + iva10productosMontoFijo.reduce((acc, el) => acc + el.precioNeto, 0)
            )
            const iva27Total = roundTwoDecimals(
                iva27productosMontoVariable.reduce((acc, el) => acc + el.precioNeto, 0)
                + iva27productosMontoFijo.reduce((acc, el) => acc + el.precioNeto, 0)
            )
            const baseImponible21 = roundTwoDecimals((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva21Total / 1.21) : iva21Total)
            const baseImponible10 = roundTwoDecimals((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva10Total / 1.105) : iva10Total)
            const baseImponible27 = roundTwoDecimals((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva27Total / 1.27) : iva27Total)
            const iva21 = roundTwoDecimals(iva21Total - baseImponible21)
            const iva10 = roundTwoDecimals(iva10Total - baseImponible10)
            const iva27 = roundTwoDecimals(iva27Total - baseImponible27)
            const importeIva = roundTwoDecimals(iva21 + iva10 + iva27)
            const total = roundTwoDecimals(totalLinesSum)
            const subTotal = roundTwoDecimals(total - importeIva)

            return {
                ...state,
                totalDescuento,
                totalRecargo,
                baseImponible21,
                baseImponible10,
                baseImponible27,
                iva21,
                iva10,
                iva27,
                importeIva,
                subTotal,
                total,
            }
        default:
            return state
    }
}

const saleReducer = {
    initialState,
    actions,
    reducer
}

export default saleReducer