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
    fechaEmision: null,
    fechaEmisionString: null,
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

const quantity = (line) => {
    let quantity = 0
    if (line.precioNetoFijo) quantity = line.precioNeto / line.precioUnitario
    if (line.fraccionar) quantity = line.cantidadUnidades / line.fraccionamiento
    else quantity = line.cantidadUnidades
    return quantity
}

const calculateNetPrice = (line, porcentajeRecargoGlobal, porcentajeDescuentoGlobal, porcentajePlanDePago) => {
    const totalWithoutModifications = line.precioUnitario * quantity(line)
    const totalWithModifications = totalWithoutModifications * (1
        + decimalPercent(line.porcentajeRecargoRenglon)
        + decimalPercent(porcentajeRecargoGlobal)
        - decimalPercent(line.porcentajeDescuentoRenglon)
        - decimalPercent(porcentajeDescuentoGlobal)
        + porcentajePlanDePago
    )
    return roundTwoDecimals(totalWithModifications)
}

const calculateGrossPrice = (line) => {
    const quantity = (line.fraccionar) ? line.cantidadUnidades / line.fraccionamiento : line.cantidadUnidades
    const grossPrice = quantity * line.precioUnitario
    return roundTwoDecimals(grossPrice)
}

const calculateSurchargeOnGrossPrice = (line, porcentajeRecargoGlobal, porcentajePlanDePago) => {
    const porcPlanPago = (porcentajePlanDePago > 0) ? porcentajePlanDePago : 0
    const totalWithoutModifications = line.precioUnitario * quantity(line)
    const totalWithModifications = totalWithoutModifications * (1
        + decimalPercent(line.porcentajeRecargoRenglon)
        + decimalPercent(porcentajeRecargoGlobal)
        + porcPlanPago
    )
    const lineSurcharge = totalWithModifications - totalWithoutModifications
    return roundTwoDecimals(lineSurcharge)
}

const calculateDiscountOnGrossPrice = (line, porcentajeDescuentoGlobal, porcentajePlanDePago) => {
    const porcPlanPago = (porcentajePlanDePago < 0) ? porcentajePlanDePago : 0
    const totalWithoutModifications = line.precioUnitario * quantity(line)
    const totalWithModifications = totalWithoutModifications * (1
        - decimalPercent(line.porcentajeDescuentoRenglon)
        - decimalPercent(porcentajeDescuentoGlobal)
        + porcPlanPago
    )
    const lineDiscount = totalWithoutModifications - totalWithModifications
    return roundTwoDecimals(lineDiscount)
}

const spanQuantity = (line) => {
    if (line.fraccionar) {
        line.cantidadKg = previousInteger(line.cantidadUnidades / line.fraccionamiento)
        line.cantidadg = line.cantidadUnidades % line.fraccionamiento
    } else {
        let remainder = (roundTwoDecimals(line.cantidadUnidades - previousInteger(line.cantidadUnidades)))
        const grams = (remainder >= 0.1) ? remainder * 1000 : remainder * 10000
        line.cantidadKg = previousInteger(line.cantidadUnidades)
        line.cantidadg = parseFloat(grams)
    }
}

const calculateQuantity = (line, porcentajeRecargoGlobal, porcentajeDescuentoGlobal, porcentajePlanDePago) => {
    const quantityWithoutModifications = (line.fraccionar)
        ? (line.precioNeto / line.precioUnitario) * line.fraccionamiento
        : line.precioNeto / line.precioUnitario
    let quantityWithModifications = 0
    if (line.porcentajeRecargoRenglon > 0 && porcentajeRecargoGlobal === 0 && porcentajeDescuentoGlobal === 0) {
        quantityWithModifications = quantityWithoutModifications * (1 - decimalPercent(line.porcentajeRecargoRenglon) - porcentajePlanDePago)
    } else if (line.porcentajeRecargoRenglon > 0 && porcentajeRecargoGlobal > 0) {
        quantityWithModifications = quantityWithoutModifications * (1 - decimalPercent(line.porcentajeRecargoRenglon) - decimalPercent(porcentajeRecargoGlobal) - porcentajePlanDePago)
    } else if (line.porcentajeRecargoRenglon > 0 && porcentajeDescuentoGlobal > 0) {
        quantityWithModifications = quantityWithoutModifications * (1 - decimalPercent(line.porcentajeRecargoRenglon) + decimalPercent(porcentajeDescuentoGlobal) - porcentajePlanDePago)
    } else if (line.porcentajeDescuentoRenglon > 0 && porcentajeRecargoGlobal === 0 && porcentajeDescuentoGlobal === 0) {
        quantityWithModifications = quantityWithoutModifications * (1 + decimalPercent(line.porcentajeDescuentoRenglon) - porcentajePlanDePago)
    } else if (line.porcentajeDescuentoRenglon > 0 && porcentajeRecargoGlobal > 0) {
        quantityWithModifications = quantityWithoutModifications * (1 + decimalPercent(line.porcentajeDescuentoRenglon) - decimalPercent(porcentajeRecargoGlobal) - porcentajePlanDePago)
    } else if (line.porcentajeDescuentoRenglon > 0 && porcentajeDescuentoGlobal > 0) {
        quantityWithModifications = quantityWithoutModifications * (1 + decimalPercent(line.porcentajeDescuentoRenglon) + decimalPercent(porcentajeDescuentoGlobal) - porcentajePlanDePago)
    } else if (line.porcentajeRecargoRenglon === 0 && porcentajeRecargoGlobal > 0 && porcentajeDescuentoGlobal === 0) {
        quantityWithModifications = quantityWithoutModifications * (1 - decimalPercent(porcentajeRecargoGlobal) - porcentajePlanDePago)
    } else if (line.porcentajeRecargoRenglon === 0 && porcentajeRecargoGlobal === 0 && porcentajeDescuentoGlobal > 0) {
        quantityWithModifications = quantityWithoutModifications * (1 + decimalPercent(porcentajeDescuentoGlobal) - porcentajePlanDePago)
    } else if (line.porcentajeRecargoRenglon === 0 && line.porcentajeDescuentoRenglon === 0 && porcentajeRecargoGlobal === 0 && porcentajeDescuentoGlobal === 0) {
        quantityWithModifications = quantityWithoutModifications * (1 - porcentajePlanDePago)
    }

    const removedQuantity = (line.porcentajeRecargoRenglon > 0 || porcentajeRecargoGlobal > 0 || porcentajePlanDePago > 0)
        ? quantityWithoutModifications - quantityWithModifications
        : 0
    const addedQuantity = (line.porcentajeDescuentoRenglon > 0 || porcentajeDescuentoGlobal > 0 || porcentajePlanDePago < 0)
        ? quantityWithModifications - quantityWithoutModifications
        : 0
    line.cantidadQuitadaPorRecargo_enKg = (line.fraccionar) ? removedQuantity / line.fraccionamiento : removedQuantity
    line.cantidadAgregadaPorDescuento_enKg = (line.fraccionar) ? addedQuantity / line.fraccionamiento : addedQuantity
    return quantityWithModifications
}

const calculateBaseQuantity = (line) => {
    return line.precioNeto / line.precioUnitario
}

const updateValues1 = (line, porcentajeRecargoGlobal, porcentajeDescuentoGlobal, porcentajePlanDePago) => {
    if (line.precioNetoFijo) {
        line.cantidadUnidades = calculateQuantity(line, porcentajeRecargoGlobal, porcentajeDescuentoGlobal, porcentajePlanDePago)
    } else {
        line.precioNeto = calculateNetPrice(line, porcentajeRecargoGlobal, porcentajeDescuentoGlobal, porcentajePlanDePago)
    }
    line.recargo = calculateSurchargeOnGrossPrice(line, porcentajeRecargoGlobal, porcentajePlanDePago)
    line.descuento = calculateDiscountOnGrossPrice(line, porcentajeDescuentoGlobal, porcentajePlanDePago)
    line.precioBruto = calculateGrossPrice(line)
    spanQuantity(line)
}

const updateValues2 = (line, recargoGlobal, descuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice) => {
    const fixed = line.precioNetoFijo
    const fractioned = line.fraccionar
    if (fixed && fractioned) {
        line.precioUnitario = productFractionedPrice
        line.cantidadUnidades = calculateQuantity(line, recargoGlobal, descuentoGlobal, porcentajePlanDePago)
    } else if (!fixed && fractioned) {
        line.precioUnitario = productFractionedPrice
        line.precioNeto = calculateNetPrice(line, recargoGlobal, descuentoGlobal, porcentajePlanDePago)
    } else if (fixed && !fractioned) {
        line.precioUnitario = productUnfractionedPrice
        line.cantidadUnidades = calculateQuantity(line, recargoGlobal, descuentoGlobal, porcentajePlanDePago)
    } else if (!fixed && !fractioned) {
        line.precioUnitario = productUnfractionedPrice
        line.cantidadUnidades = calculateBaseQuantity(line)
        line.precioNeto = calculateNetPrice(line, recargoGlobal, descuentoGlobal, porcentajePlanDePago)
    }
    line.recargo = calculateSurchargeOnGrossPrice(line, recargoGlobal, porcentajePlanDePago)
    line.descuento = calculateDiscountOnGrossPrice(line, descuentoGlobal, porcentajePlanDePago)
    line.precioBruto = calculateGrossPrice(line)
    spanQuantity(line)
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
            if (action.payload === 'discount') {
                state.porcentajeDescuentoGlobal = state.porcentajeRecargoGlobal
                state.porcentajeRecargoGlobal = 0
                const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(state.planesPago[0].porcentaje) : 0
                state.renglones.map((line) => {
                    updateValues1(line, 0, state.porcentajeDescuentoGlobal, porcentajePlanDePago)
                    return line
                })
            }
            if (action.payload === 'surcharge') {
                state.porcentajeRecargoGlobal = state.porcentajeDescuentoGlobal
                state.porcentajeDescuentoGlobal = 0
                const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(state.planesPago[0].porcentaje) : 0
                state.renglones.map((line) => {
                    updateValues1(line, state.porcentajeRecargoGlobal, 0, porcentajePlanDePago)
                    return line
                })
            }
            return {
                ...state,
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
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(state.planesPago[0].porcentaje) : 0
                    updateValues1(line, 0, action.payload, porcentajePlanDePago)
                    return line
                }),
            }
        case actions.SET_GLOBAL_SURCHARGE_PERCENT:
            return {
                ...state,
                porcentajeRecargoGlobal: action.payload,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(state.planesPago[0].porcentaje) : 0
                    updateValues1(line, action.payload, 0, porcentajePlanDePago)
                    return line
                }),
            }
        case actions.SET_LINE_QUANTITY:
            return {
                ...state,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(state.planesPago[0].porcentaje) : 0
                    if (line._id === action.payload._id) {
                        line.cantidadUnidades = action.payload.cantidadUnidades
                        if (!line.precioNetoFijo) {
                            line.precioNeto = calculateNetPrice(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago)
                            line.precioBruto = calculateGrossPrice(line)
                        }
                        spanQuantity(line)
                    }
                    return line
                }),
            }
        case actions.SET_NET_PRICE:
            return {
                ...state,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(state.planesPago[0].porcentaje) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    if (line._id === action.payload._id) {
                        (line.fraccionar)
                            ? line.precioUnitario = productFractionedPrice
                            : line.precioUnitario = productUnfractionedPrice
                        line.precioNeto = action.payload.precioNeto
                        line.cantidadUnidades = calculateQuantity(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago)
                        spanQuantity(line)
                        line.precioBruto = calculateGrossPrice(line)
                    }
                    return line
                }),
            }
        case actions.SET_NET_PRICE_FIXED:
            return {
                ...state,
                renglones: state.renglones.map((line) => {
                    const recargoGlobal = state.porcentajeRecargoGlobal
                    const descuentoGlobal = state.porcentajeDescuentoGlobal
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(state.planesPago[0].porcentaje) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    if (line._id === action.payload._id) {
                        line.precioNetoFijo = action.payload.precioNetoFijo
                        updateValues2(line, recargoGlobal, descuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
                    }
                    return line
                }),
            }
        case actions.SET_LINE_DISCOUNT_PERCENT:
            return {
                ...state,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(state.planesPago[0].porcentaje) : 0
                    if (line._id === action.payload._id) {
                        line.porcentajeDescuentoRenglon = action.payload.porcentajeDescuentoRenglon
                        updateValues1(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago)
                    }
                    return line
                }),
            }
        case actions.SET_LINE_SURCHARGE_PERCENT:
            return {
                ...state,
                renglones: state.renglones.map((line) => {
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(state.planesPago[0].porcentaje) : 0
                    if (line._id === action.payload._id) {
                        line.porcentajeRecargoRenglon = action.payload.porcentajeRecargoRenglon
                        updateValues1(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePago)
                    }
                    return line
                }),
            }
        case actions.SET_LINES:
            return {
                ...state,
                renglones: action.payload.map((product) => {
                    const linePresent = state.renglones.find(renglon => renglon._id === product._id)
                    if (linePresent) return linePresent
                    return {
                        _id: product._id,
                        nombre: product.nombre,
                        codigoBarras: product.codigoBarras,
                        precioUnitario: product.precioVenta,
                        porcentajeIva: (product.porcentajeIvaVenta) ? product.porcentajeIvaVenta : 0,
                        importeIva: (product.ivaVenta) ? product.ivaVenta : 0,
                        fraccionamiento: (product.unidadMedida) ? product.unidadMedida.fraccionamiento : 1,
                        fraccionar: false,
                        cantidadUnidades: 0,
                        cantidadQuitadaPorRecargo_enKg: 0,
                        cantidadAgregadaPorDescuento_enKg: 0,
                        cantidadKg: 0,
                        cantidadg: 0,
                        porcentajeRecargoRenglon: 0,
                        porcentajeDescuentoRenglon: 0,
                        recargo: 0,
                        descuento: 0,
                        precioNeto: 0,
                        precioNetoFijo: false,
                        precioBruto: 0
                    }
                }),
            }
        case actions.SET_FRACTIONED:
            return {
                ...state,
                renglones: state.renglones.map(line => {
                    const recargoGlobal = state.porcentajeRecargoGlobal
                    const descuentoGlobal = state.porcentajeDescuentoGlobal
                    const porcentajePlanDePago = (state.planesPago.length > 0) ? decimalPercent(state.planesPago[0].porcentaje) : 0
                    const productUnfractionedPrice = state.productos.find(product => product._id === line._id).precioVenta
                    const productFractionedPrice = state.productos.find(product => product._id === line._id).precioVentaFraccionado
                    if (line._id === action.payload._id) {
                        line = action.payload
                        updateValues2(line, recargoGlobal, descuentoGlobal, porcentajePlanDePago, productUnfractionedPrice, productFractionedPrice)
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
            return {
                ...state,
                cliente: action.payload,
                clienteRazonSocial: action.payload.razonSocial,
                clienteDireccion: action.payload.direccion,
                clienteIdentificador: action.payload.cuit,
                clienteCondicionIva: action.payload.condicionFiscal.nombre,
                clienteDocumentoReceptor: action.payload.documentoReceptor
            }
        case actions.SET_DOCUMENT:
            return {
                ...state,
                documento: action.payload,
                documentoLetra: action.payload.letra,
                documentoFiscal: action.payload.fiscal,
                documentoCodigo: action.payload.codigoUnico,
                documentoDocumentoReceptor: action.payload.documentoReceptor
            }
        case actions.SET_COMPANY:
            return {
                ...state,
                empresa: action.payload,
                empresaRazonSocial: action.payload.razonSocial,
                empresaDireccion: action.payload.direccion,
                empresaCondicionIva: action.payload.condicionFiscal.nombre,
                empresaCuit: action.payload.cuit,
                empresaIngresosBrutos: action.payload.ingresosBrutos,
                empresaInicioActividad: action.payload.fechaInicioActividad,
                empresaLogo: action.payload.logo.url
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
                fechaEmision: new Date(),
                fechaEmisionString: simpleDateWithHours(new Date()),
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
        case actions.SET_PAYMENT_PLANS:
            const plans = action.payload.map(item => JSON.parse(item))
            const planNames = plans.map(item => item.nombre)
            const porcentajePlanDePagoSeleccionado = (action.payload.length > 0) ? decimalPercent((JSON.parse(action.payload[0])).porcentaje) : 0
            state.renglones.map((line) => {
                (line.precioNetoFijo)
                    ? line.cantidadUnidades = calculateQuantity(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePagoSeleccionado)
                    : line.precioNeto = calculateNetPrice(line, state.porcentajeRecargoGlobal, state.porcentajeDescuentoGlobal, porcentajePlanDePagoSeleccionado)
                spanQuantity(line)
                return line
            })
            return {
                ...state,
                planesPago: plans,
                planesPagoNombres: planNames
            }
        case actions.SET_TOTAL:
            if (state.renglones.length === 0) return state

            // ---------------- Cálculos correspondientes a ítems de precio VARIABLE ---------------- //
            const variableAmountLines = state.renglones.filter(renglon => renglon.precioNetoFijo === false)
            const variableLinesSumBasePrice = variableAmountLines.reduce((acc, el) => acc + el.precioBruto, 0)
            const totalDescuentoVariable = roundTwoDecimals(variableAmountLines.reduce((acc, el) => acc + el.descuento, 0))
            const totalRecargoVariable = roundTwoDecimals(variableAmountLines.reduce((acc, el) => acc + el.recargo, 0))

            // ---------------- Cálculos correspondientes a ítems de precio FIJADO ---------------- //
            const fixedAmountLines = state.renglones.filter(renglon => renglon.precioNetoFijo === true)
            const fixedLinesSumBasePrice = fixedAmountLines.reduce((acc, el) => acc + el.precioNeto, 0)
            const totalDescuentoFijo = 0    // Cero porque el cliente abona un monto fijo.
            const totalRecargoFijo = 0      // Cero porque el cliente abona un monto fijo.

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
            const total = roundTwoDecimals(totalLinesSum + totalRecargo - totalDescuento)
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
    reducer,
    actions,
}

export default saleReducer