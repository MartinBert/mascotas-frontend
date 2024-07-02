// Design Components
import dayjs from 'dayjs'

// Helpers
import helpers from '../helpers'

const { decimalPercent, previousInteger, roundToMultiple, roundTwoDecimals } = helpers.mathHelper
const { formatToCompleteVoucherNumber } = helpers.afipHelper
const { localFormat, simpleDateWithHours } = helpers.dateHelper


const actions = {
    // ---------------- Actions of events ---------------- //
    CLOSE_FISCAL_OPERATION: 'CLOSE_FISCAL_OPERATION',
    CLOSE_NO_FISCAL_OPERATION: 'CLOSE_NO_FISCAL_OPERATION',
    HIDE_FINALIZE_SALE_MODAL: 'HIDE_FINALIZE_SALE_MODAL',
    LOADING_DOCUMENT_INDEX: 'LOADING_DOCUMENT_INDEX',
    LOADING_VIEW: 'LOADING_VIEW',
    SET_CUSTOM_CONCEPT: 'SET_CUSTOM_CONCEPT',
    SET_CUSTOM_PERCENTAGE_IVA: 'SET_CUSTOM_PERCENTAGE_IVA',
    SET_CUSTOM_UNIT_PRICE: 'SET_CUSTOM_UNIT_PRICE',
    SET_ERROR_IF_NOT_EXISTS_PRODUCTS: 'SET_ERROR_IF_NOT_EXISTS_PRODUCTS',
    SET_EXISTS_LINE_ERROR: 'SET_EXISTS_LINE_ERROR',
    SET_GENERAL_PERCENTAGE_TYPE: 'SET_GENERAL_PERCENTAGE_TYPE',
    SET_LOADING_TO_FINALIZE_SALE: 'SET_LOADING_TO_FINALIZE_SALE',
    SET_OPTIONS_TO_SELECT_CLIENT: 'SET_OPTIONS_TO_SELECT_CLIENT',
    SET_OPTIONS_TO_SELECT_DOCUMENT: 'SET_OPTIONS_TO_SELECT_DOCUMENT',
    SET_OPTIONS_TO_SELECT_PAYMENT_METHOD: 'SET_OPTIONS_TO_SELECT_PAYMENT_METHOD',
    SET_OPTIONS_TO_SELECT_PAYMENT_PLAN: 'SET_OPTIONS_TO_SELECT_PAYMENT_PLAN',
    SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE',
    SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME: 'SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME',
    SET_REFS: 'SET_REFS',
    SET_STATUS_OF_CLIENT: 'SET_STATUS_OF_CLIENT',
    SET_STATUS_OF_CUSTOM_CONCEPT: 'SET_STATUS_OF_CUSTOM_CONCEPT',
    SET_STATUS_OF_CUSTOM_PERCENTAGE_IVA: 'SET_STATUS_OF_CUSTOM_PERCENTAGE_IVA',
    SET_STATUS_OF_CUSTOM_PRODUCT: 'SET_STATUS_OF_CUSTOM_PRODUCT',
    SET_STATUS_OF_CUSTOM_UNIT_PRICE: 'SET_STATUS_OF_CUSTOM_UNIT_PRICE',
    SET_STATUS_OF_DOCUMENT: 'SET_STATUS_OF_DOCUMENT',
    SET_STATUS_OF_GENERAL_PERCENTAGE: 'SET_STATUS_OF_GENERAL_PERCENTAGE',
    SET_STATUS_OF_PAYMENT_METHOD: 'SET_STATUS_OF_PAYMENT_METHOD',
    SET_STATUS_OF_PAYMENT_PLAN: 'SET_STATUS_OF_PAYMENT_PLAN',
    SET_STATUS_TO_FINALIZE_SALE: 'SET_STATUS_TO_FINALIZE_SALE',
    SHOW_FINALIZE_SALE_MODAL: 'SHOW_FINALIZE_SALE_MODAL',
    UPDATE_LINES_VALUES: 'UPDATE_LINES_VALUES',
    UPDATE_TOTALS: 'UPDATE_TOTALS',

    // -------------- Actions of sale data --------------- //
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    SET_CLIENT: 'SET_CLIENT',
    SET_COMPANY: 'SET_COMPANY',
    SET_DATES: 'SET_DATES',
    SET_DOCUMENT: 'SET_DOCUMENT',
    SET_FRACTIONED: 'SET_FRACTIONED',
    SET_GENERAL_PERCENTAGE: 'SET_GENERAL_PERCENTAGE',
    SET_INDEX: 'SET_INDEX',
    SET_LINE_DISCOUNT_PERCENTAGE: 'SET_LINE_DISCOUNT_PERCENTAGE',
    SET_LINE_NOTE: 'SET_LINE_NOTE',
    SET_LINE_QUANTITY: 'SET_LINE_QUANTITY',
    SET_LINE_SURCHARGE_PERCENTAGE: 'SET_LINE_SURCHARGE_PERCENTAGE',
    SET_LINES: 'SET_LINES',
    SET_NET_PRICE: 'SET_NET_PRICE',
    SET_NET_PRICE_FIXED: 'SET_NET_PRICE_FIXED',
    SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
    SET_PAYMENT_PLAN: 'SET_PAYMENT_PLAN',
    SET_PRODUCT: 'SET_PRODUCT',
    SET_SALE_POINT: 'SET_SALE_POINT',
    SET_USER: 'SET_USER',
    SET_VOUCHER_NUMBERS: 'SET_VOUCHER_NUMBERS'
}

const initialState = {
    // ------------- Initial state of events ------------- //
    customProductParams: {
        concept: null,
        percentageIva: null,
        unitPrice: null
    },
    errorIfNotExistsProducts: false,
    existsLineError: false,
    fieldStatus: {
        client: null,
        customProduct: {
            concept: null,
            percentageIva: null,
            unitPrice: null
        },
        document: null,
        generalPercentage: null,
        paymentMethod: null,
        paymentPlan: null
    },
    finalizeSaleModalIsVisible: false,
    generalPercentage: null,
    generalPercentageType: null,
    lastModifiedParameter: {
        parameter: null,
        timesModified: 0
    },
    loadingDocumentIndex: false,
    loadingFinalizeSale: false,
    loadingView: false,
    refs: {
        buttonToAddCustomProduct: null,
        buttonToCancelFinalizeSale: null,
        buttonToFinalizeSale: null,
        buttonToSaveFinalizeSale: null,
        datePicker: null,
        inputCustomConcept: null,
        inputCustomPercentageIva: null,
        inputCustomProduct: null,
        inputCustomUnitPrice: null,
        inputGeneralPercentage: null,
        inputGeneralPercentageValue: null,
        salesIndex: null,
        selectClient: null,
        selectDocument: null,
        selectGeneralPercentageType: null,
        selectPaymentMethod: null,
        selectPaymentPlan: null,
        selectToAddProductByBarcode: null,
        selectToAddProductByName: null
    },
    selectClient: {
        options: [],
        selectedValue: null
    },
    selectDocument: {
        options: [],
        selectedValue: null
    },
    selectGeneralPercentageType: {
        options: [{ label: 'Descuento', value: 'discount' }, { label: 'Recargo', value: 'surcharge' }],
        selectedValue: null
    },
    selectPaymentMethod: {
        options: [],
        selectedValue: null
    },
    selectPaymentPlan: {
        options: [],
        selectedValue: null
    },
    selectToAddProductByBarcode: {
        options: [],
        selectedValue: null
    },
    selectToAddProductByName: {
        options: [],
        selectedValue: null
    },
    selectToAddProductByProductCode: {
        options: [],
        selectedValue: null
    },
    valueForDatePicker: null,

    // ------------ Initial state of sale data ----------- //
    baseImponible10: 0,
    baseImponible21: 0,
    baseImponible27: 0,
    cae: null,
    cliente: null,
    clienteCondicionIva: null,
    clienteDireccion: null,
    clienteIdentificador: null,
    clienteDocumentoReceptor: null,
    clienteRazonSocial: null,
    closedSale: false,
    condicionVenta: 'Contado',
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
    fechaEmision: new Date(),
    fechaEmisionString: simpleDateWithHours(new Date()),
    importeIva: 0,
    indice: null,
    iva21: 0,
    iva10: 0,
    iva27: 0,
    mediosPago: [],
    mediosPagoNombres: [],
    numeroFactura: null,
    numeroCompletoFactura: null,
    planesPago: [],
    planesPagoNombres: [],
    porcentajeDescuentoGlobal: null,
    porcentajeRecargoGlobal: null,
    productos: [],
    profit: 0,
    puntoVenta: null,
    puntoVentaNumero: null,
    puntoVentaNombre: null,
    renglones: [],
    subTotal: 0,
    total: 0,
    totalDescuento: 0,
    totalRecargo: 0,
    usuario: null,
    vencimientoCae: null
}

const editGrossPrice = (line) => {
    const quantity = line.fraccionar ? line.cantidadUnidades / line.fraccionamiento : line.cantidadUnidades
    const grossPrice = roundToMultiple(quantity * line.precioUnitario, 10)
    return grossPrice
}

const editMetadata = (line, stateData) => {
    const { generalDiscount, generalSurcharge, lastParameterModified, paymentPlanPercentage } = stateData
    const { currentQuantity, fixedQuantity } = editProductQuantity(line, stateData)
    const netPriceFixedOrModified = line.precioNetoFijo || lastParameterModified === 'lineNetPrice'
    const quantityWasAdded = (
        netPriceFixedOrModified && (
            roundTwoDecimals(line.porcentajeDescuentoRenglon) > 0
            || roundTwoDecimals(generalDiscount) > 0
            || roundTwoDecimals(paymentPlanPercentage) < 0
        )
    )
    const quantityWasRemoved = (
        netPriceFixedOrModified && (
            roundTwoDecimals(line.porcentajeRecargoRenglon) > 0
            || roundTwoDecimals(generalSurcharge) > 0
            || roundTwoDecimals(paymentPlanPercentage) > 0
        )
    )
    const addedQuantity = quantityWasAdded ? fixedQuantity - currentQuantity : 0
    const fixedAddedQuantity = line.fraccionar
        ? roundTwoDecimals(addedQuantity / line.fraccionamiento)
        : roundTwoDecimals(addedQuantity)
    const removedQuantity = quantityWasRemoved ? currentQuantity - fixedQuantity : 0
    const fixedRemovedQuantity = line.fraccionar
        ? roundTwoDecimals(removedQuantity / line.fraccionamiento)
        : roundTwoDecimals(removedQuantity)
    const data = {
        cantidadAgregadaPorDescuento_enKg: fixedAddedQuantity,
        cantidadQuitadaPorRecargo_enKg: fixedRemovedQuantity
    }
    return data
}

const editNetPrice = (line, lineDiscount, lineSurcharge) => {
    const grossPrice = editGrossPrice(line)
    const netPrice = grossPrice - lineDiscount + lineSurcharge
    const roundedNetPrice = roundToMultiple(netPrice, 10)
    return roundedNetPrice
}

const editProductQuantity = (line, stateData) => {
    const { generalDiscount, generalSurcharge, paymentPlanPercentage } = stateData
    const lineDiscountPercentage = fixLineDiscountPercentage(line)
    const lineSurchargePercentage = fixLineSurchargePercentage(line)
    const currentQuantity = line.fraccionar
        ? (line.precioNeto / line.precioUnitario) * line.fraccionamiento
        : line.precioNeto / line.precioUnitario
    const fixedQuantity = currentQuantity * (1
        - decimalPercent(lineSurchargePercentage)
        - decimalPercent(generalSurcharge)
        + decimalPercent(lineDiscountPercentage)
        + decimalPercent(generalDiscount)
        + (paymentPlanPercentage > 0 ? - paymentPlanPercentage : paymentPlanPercentage)
    )
    const roundedCurrentQuantity = roundTwoDecimals(currentQuantity)
    const roundedFixedQuantity = roundTwoDecimals(fixedQuantity)
    const data = {
        currentQuantity: roundedCurrentQuantity,
        fixedQuantity: roundedFixedQuantity
    }
    return data
}

const editProductSpanQuantity = (line) => {
    const unitMeasureInlcudesKilograms = line?.unidadMedida.toLowerCase().includes('kilo') ?? null
    const unitMeasureInlcudesGrams = line?.unidadMedida.toLowerCase().includes(' gramo') ?? null
    const isUnitMeasureGramsToGrams = (!unitMeasureInlcudesKilograms && unitMeasureInlcudesGrams) ? true : false
    if (line.fraccionar) {
        if (line.fraccionamiento < 1000 && !isUnitMeasureGramsToGrams) {
            line.cantidadKg = roundTwoDecimals(previousInteger(line.cantidadUnidades))
            line.cantidadg = 0
        } else {
            line.cantidadKg = roundTwoDecimals(previousInteger(line.cantidadUnidades / 1000))
            line.cantidadg = roundTwoDecimals(line.cantidadUnidades % 1000)
        }
    } else {
        if (line.fraccionamiento < 1000) {
            if (isUnitMeasureGramsToGrams) {
                const remainder = (line.cantidadUnidades % 1000)
                line.cantidadKg = roundTwoDecimals(previousInteger(line.cantidadUnidades * line.fraccionamiento / 1000))
                line.cantidadg = roundTwoDecimals(remainder * line.fraccionamiento % 1000)
            } else {
                const remainder = line.cantidadUnidades * line.fraccionamiento - previousInteger(line.cantidadUnidades * line.fraccionamiento)
                line.cantidadKg = roundTwoDecimals(previousInteger(line.cantidadUnidades * line.fraccionamiento))
                line.cantidadg = roundTwoDecimals(remainder * 1000)
            }
        } else {
            line.cantidadKg = roundTwoDecimals(previousInteger(line.cantidadUnidades))
            line.cantidadg = roundTwoDecimals((line.cantidadUnidades - previousInteger(line.cantidadUnidades)) * 1000)
        }
    }
}

const fixLineDiscountPercentage = (line) => {
    if (!line.porcentajeDescuentoRenglon) return null
    if (line.porcentajeDescuentoRenglon.endsWith('.') || line.porcentajeDescuentoRenglon.endsWith(',')) return null
    return line.porcentajeDescuentoRenglon
}

const fixLineSurchargePercentage = (line) => {
    if (!line.porcentajeRecargoRenglon) return null
    if (line.porcentajeRecargoRenglon.endsWith('.') || line.porcentajeRecargoRenglon.endsWith(',')) return null
    return line.porcentajeRecargoRenglon
}

const getLineDiscount = (line, discountData) => {
    const { generalDiscount, paymentPlanPercentage } = discountData
    const grossPrice = editGrossPrice(line)
    const lineDiscountPercentage = fixLineDiscountPercentage(line)

    let lineDiscount
    if (line.precioNetoFijo) {
        lineDiscount = grossPrice > line.precioNeto ? grossPrice - line.precioNeto : 0
    } else {
        const netPrice = grossPrice * (1
            - decimalPercent(lineDiscountPercentage)
            - decimalPercent(generalDiscount)
            + (paymentPlanPercentage < 0 ? paymentPlanPercentage : 0)
        )
        lineDiscount = grossPrice - netPrice
    }
    const roundedLineDiscount = roundTwoDecimals(lineDiscount)
    return roundedLineDiscount
}

const getLineSurcharge = (line, surchargeData) => {
    const { generalSurcharge, paymentPlanPercentage } = surchargeData
    const grossPrice = editGrossPrice(line)
    const lineSurchargePercentage = fixLineSurchargePercentage(line)

    let lineSurcharge
    if (line.precioNetoFijo) {
        lineSurcharge = line.precioNeto > grossPrice ? line.precioNeto - grossPrice : 0
    } else {
        const netPrice = grossPrice * (1
            + decimalPercent(lineSurchargePercentage)
            + decimalPercent(generalSurcharge)
            + (paymentPlanPercentage > 0 ? paymentPlanPercentage : 0)
        )
        lineSurcharge = netPrice - grossPrice
    }
    const roundedLineSurcharge = roundTwoDecimals(lineSurcharge)
    return roundedLineSurcharge
}

const updateLinesValues = (state) => {
    const verified = verifyUpdateLinesValues(state)
    if (!verified) return state.renglones

    // State data
    const generalDiscount = state.porcentajeDescuentoGlobal
    const generalSurcharge = state.porcentajeRecargoGlobal
    const lastParameterModified = state.lastModifiedParameter.parameter
    const paymentPlanPercentage = state.planesPago.length > 0 ? decimalPercent(parseFloat(state.planesPago[0].porcentaje)) : 0
    const discountData = { generalDiscount, paymentPlanPercentage }
    const surchargeData = { generalSurcharge, paymentPlanPercentage }
    const stateData = { generalDiscount, generalSurcharge, lastParameterModified, paymentPlanPercentage }

    const updatedLines = state.renglones.map(line => {
        // Line data
        const lineDiscount = getLineDiscount(line, discountData)
        const lineSurcharge = getLineSurcharge(line, surchargeData)
        const lineNetPrice = (!line.precioNetoFijo || lastParameterModified === 'lineQuantity') && !(lastParameterModified === 'lineNetPrice')
            ? editNetPrice(line, lineDiscount, lineSurcharge)
            : line.precioNeto
        const lineQuantity = (line.precioNetoFijo || lastParameterModified === 'lineNetPrice') && !(lastParameterModified === 'lineQuantity')
            ? editProductQuantity(line, stateData).fixedQuantity
            : line.cantidadUnidades
        const product = state.productos.find(product => product._id === line._id)
        const productFractionedPrice = product.precioVentaFraccionado ?? product.precioVenta
        const productUnfractionedPrice = product.precioVenta

        line.cantidadAgregadaPorDescuento_enKg = editMetadata(line, stateData).cantidadAgregadaPorDescuento_enKg
        line.cantidadQuitadaPorRecargo_enKg = editMetadata(line, stateData).cantidadQuitadaPorRecargo_enKg
        line.cantidadUnidades = lineQuantity === 0 ? null : lineQuantity
        line.descuento = roundToMultiple(lineDiscount, 10)
        line.precioBruto = editGrossPrice(line)
        line.precioNeto = lineNetPrice === 0 ? null : lineNetPrice
        line.precioUnitario = line.fraccionar ? roundToMultiple(productFractionedPrice, 10) : roundToMultiple(productUnfractionedPrice, 10)
        line.importeIva = roundTwoDecimals(decimalPercent(line.porcentajeIva) * line.precioBruto)
        line.profit = roundTwoDecimals(line.precioNeto - line.importeIva)
        line.recargo = roundToMultiple(lineSurcharge, 10)
        editProductSpanQuantity(line)
        return line
    })

    return updatedLines
}

const updateTotals = (state) => {
    const verified = verifyUpdateTotals(state)
    if (!verified) {
        state.baseImponible10 = 0
        state.baseImponible21 = 0
        state.baseImponible27 = 0
        state.iva10 = 0
        state.iva21 = 0
        state.iva27 = 0
        state.importeIva = 0
        state.profit = 0
        state.subTotal = 0
        state.total = 0
        state.totalDescuento = 0
        state.totalRecargo = 0
        return state
    }

    const fixDiscountAndSurcharge = (percentageValue) => {
        if (
            !percentageValue
            || percentageValue.toString().endsWith('.')
            || percentageValue.toString().endsWith(',')
        ) return 0
        else return parseFloat(percentageValue)
    }

    const fixNetPrice = (line) => {
        if (
            !line.precioNeto
            || !line.cantidadUnidades
            || line.precioNeto.toString().endsWith('.')
            || line.precioNeto.toString().endsWith(',')
            || line.cantidadUnidades.toString().endsWith('.')
            || line.cantidadUnidades.toString().endsWith(',')
        ) return 0
        else return parseFloat(line.precioNeto)
    }

    // ---------------- Cálculos correspondientes a ítems de precio VARIABLE ---------------- //
    const variableAmountLines = state.renglones.filter(renglon => !renglon.precioNetoFijo)
    const variableLinesSumBasePrice = roundTwoDecimals(variableAmountLines.reduce((acc, line) => acc + fixNetPrice(line), 0))
    const totalDescuentoVariable = roundTwoDecimals(variableAmountLines.reduce((acc, line) => acc + fixDiscountAndSurcharge(line.descuento), 0))
    const totalRecargoVariable = roundTwoDecimals(variableAmountLines.reduce((acc, line) => acc + fixDiscountAndSurcharge(line.recargo), 0))

    // ---------------- Cálculos correspondientes a ítems de precio FIJADO ---------------- //
    const fixedAmountLines = state.renglones.filter(renglon => renglon.precioNetoFijo)
    const fixedLinesSumBasePrice = roundTwoDecimals(fixedAmountLines.reduce((acc, line) => acc + fixNetPrice(line), 0))
    const totalDescuentoFijo = roundTwoDecimals(fixedAmountLines.reduce((acc, line) => acc + fixDiscountAndSurcharge(line.descuento), 0))
    const totalRecargoFijo = roundTwoDecimals(fixedAmountLines.reduce((acc, line) => acc + fixDiscountAndSurcharge(line.recargo), 0))

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
        iva21productosMontoVariable.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
        + iva21productosMontoFijo.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
    )
    const iva10Total = roundTwoDecimals(
        iva10productosMontoVariable.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
        + iva10productosMontoFijo.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
    )
    const iva27Total = roundTwoDecimals(
        iva27productosMontoVariable.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
        + iva27productosMontoFijo.reduce((acc, el) => acc + parseFloat(el.precioNeto), 0)
    )
    const baseImponible21 = roundTwoDecimals((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva21Total / 1.21) : iva21Total)
    const baseImponible10 = roundTwoDecimals((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva10Total / 1.105) : iva10Total)
    const baseImponible27 = roundTwoDecimals((state.documentoLetra === 'A' || state.documentoLetra === 'B') ? (iva27Total / 1.27) : iva27Total)
    const iva21 = roundTwoDecimals(iva21Total - baseImponible21)
    const iva10 = roundTwoDecimals(iva10Total - baseImponible10)
    const iva27 = roundTwoDecimals(iva27Total - baseImponible27)
    const importeIva = roundTwoDecimals(iva21 + iva10 + iva27)
    const total = roundTwoDecimals(totalLinesSum)
    const totalRedondeado = roundToMultiple(total, 10)
    const totalDiferencia = roundTwoDecimals(totalRedondeado - total)
    const subTotal = roundTwoDecimals(total - importeIva)
    const profit = state.renglones.reduce((acc, el) => acc + parseFloat(el.profit), 0)

    state.baseImponible21 = baseImponible21
    state.baseImponible10 = baseImponible10
    state.baseImponible27 = baseImponible27
    state.importeIva = importeIva
    state.iva21 = iva21
    state.iva10 = iva10
    state.iva27 = iva27
    state.profit = profit
    state.subTotal = subTotal
    state.total = total
    state.totalDescuento = totalDescuento
    state.totalDiferencia = totalDiferencia
    state.totalRecargo = totalRecargo
    state.totalRedondeado = totalRedondeado

    return state
}

const verifyUpdateLinesValues = (state) => {
    if (
        !state.porcentajeDescuentoGlobal
        && !state.porcentajeRecargoGlobal
        && state.mediosPago.length === 0
        && state.planesPago.length === 0
        && state.renglones.length === 0
    ) return false
    return true
}

const verifyUpdateTotals = (state) => {
    if (state.renglones.length === 0) return false
    return true
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        // ---------------- Actions of events ---------------- //
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
        case actions.HIDE_FINALIZE_SALE_MODAL:
            return {
                ...state,
                finalizeSaleModalIsVisible: false
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
        case actions.SET_CUSTOM_CONCEPT:
            return {
                ...state,
                customProductParams: {
                    ...state.customProductParams,
                    concept: action.payload
                }
            }
        case actions.SET_CUSTOM_PERCENTAGE_IVA:
            return {
                ...state,
                customProductParams: {
                    ...state.customProductParams,
                    percentageIva: action.payload
                }
            }
        case actions.SET_CUSTOM_UNIT_PRICE:
            return {
                ...state,
                customProductParams: {
                    ...state.customProductParams,
                    unitPrice: action.payload
                }
            }
        case actions.SET_ERROR_IF_NOT_EXISTS_PRODUCTS:
            return {
                ...state,
                errorIfNotExistsProducts: action.payload
            }
        case actions.SET_EXISTS_LINE_ERROR:
            return {
                ...state,
                existsLineError: action.payload
            }
        case actions.SET_GENERAL_PERCENTAGE_TYPE:
            const discountAndSurchargeAreNull = state.porcentajeDescuentoGlobal === null && state.porcentajeRecargoGlobal === null
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'generalPercentageType',
                    timesModified: state.lastModifiedParameter.parameter === 'generalPercentageType'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                generalPercentageType: action.payload,
                porcentajeDescuentoGlobal: (action.payload === 'discount' && !discountAndSurchargeAreNull)
                    ? state.porcentajeRecargoGlobal
                    : action.payload === 'discount'
                        ? state.generalPercentage
                        : null,
                porcentajeRecargoGlobal: (action.payload === 'surcharge' && !discountAndSurchargeAreNull)
                    ? state.porcentajeDescuentoGlobal
                    : action.payload === 'surcharge'
                        ? state.generalPercentage
                        : null,
                selectGeneralPercentageType: {
                    ...state.selectGeneralPercentageType,
                    selectedValue: action.payload
                }
            }
        case actions.SET_LOADING_TO_FINALIZE_SALE:
            return {
                ...state,
                loadingFinalizeSale: action.payload
            }
        case actions.SET_OPTIONS_TO_SELECT_CLIENT:
            return {
                ...state,
                selectClient: {
                    ...state.selectClient,
                    options: action.payload
                }
            }
        case actions.SET_OPTIONS_TO_SELECT_DOCUMENT:
            return {
                ...state,
                selectDocument: {
                    ...state.selectDocument,
                    options: action.payload
                }
            }
        case actions.SET_OPTIONS_TO_SELECT_PAYMENT_METHOD:
            return {
                ...state,
                selectPaymentMethod: {
                    ...state.selectPaymentMethod,
                    options: action.payload
                }
            }
        case actions.SET_OPTIONS_TO_SELECT_PAYMENT_PLAN:
            return {
                ...state,
                selectPaymentPlan: {
                    ...state.selectPaymentPlan,
                    options: action.payload
                }
            }
        case actions.SET_OPTIONS_TO_SELECT_PRODUCT_BY_BARCODE:
            return {
                ...state,
                selectToAddProductByBarcode: {
                    ...state.selectToAddProductByBarcode,
                    options: action.payload
                }
            }
        case actions.SET_OPTIONS_TO_SELECT_PRODUCT_BY_NAME:
            return {
                ...state,
                selectToAddProductByName: {
                    ...state.selectToAddProductByName,
                    options: action.payload
                }
            }
        case actions.SET_REFS:
            return {
                ...state,
                refs: action.payload
            }
        case actions.SET_STATUS_OF_CLIENT:
            return {
                ...state,
                fieldStatus: {
                    ...state.fieldStatus,
                    client: action.payload
                }
            }
        case actions.SET_STATUS_OF_CUSTOM_CONCEPT:
            return {
                ...state,
                fieldStatus: {
                    ...state.fieldStatus,
                    customProduct: {
                        ...state.fieldStatus.customProduct,
                        concept: action.payload
                    }
                }
            }
        case actions.SET_STATUS_OF_CUSTOM_PERCENTAGE_IVA:
            return {
                ...state,
                fieldStatus: {
                    ...state.fieldStatus,
                    customProduct: {
                        ...state.fieldStatus.customProduct,
                        percentageIva: action.payload
                    }
                }
            }
        case actions.SET_STATUS_OF_CUSTOM_PRODUCT:
            return {
                ...state,
                fieldStatus: {
                    ...state.fieldStatus,
                    customProduct: action.payload
                }
            }
        case actions.SET_STATUS_OF_CUSTOM_UNIT_PRICE:
            return {
                ...state,
                fieldStatus: {
                    ...state.fieldStatus,
                    customProduct: {
                        ...state.fieldStatus.customProduct,
                        unitPrice: action.payload
                    }
                }
            }
        case actions.SET_STATUS_OF_DOCUMENT:
            return {
                ...state,
                fieldStatus: {
                    ...state.fieldStatus,
                    document: action.payload
                }
            }
        case actions.SET_STATUS_OF_GENERAL_PERCENTAGE:
            return {
                ...state,
                fieldStatus: {
                    ...state.fieldStatus,
                    generalPercentage: action.payload
                }
            }
        case actions.SET_STATUS_OF_PAYMENT_METHOD:
            return {
                ...state,
                fieldStatus: {
                    ...state.fieldStatus,
                    paymentMethod: action.payload
                }
            }
        case actions.SET_STATUS_OF_PAYMENT_PLAN:
            return {
                ...state,
                fieldStatus: {
                    ...state.fieldStatus,
                    paymentPlan: action.payload
                }
            }
        case actions.SET_STATUS_TO_FINALIZE_SALE:
            return {
                ...state,
                fieldStatus: action.payload
            }
        case actions.SHOW_FINALIZE_SALE_MODAL:
            return {
                ...state,
                finalizeSaleModalIsVisible: true
            }
        case actions.UPDATE_LINES_VALUES:
            const updatedLines = updateLinesValues(state)
            return {
                ...state,
                renglones: updatedLines
            }
        case actions.UPDATE_TOTALS:
            const updatedState = updateTotals(state)
            return updatedState

        // -------------- Actions of sale data --------------- //
        case actions.DELETE_PRODUCT:
            const remainingProducts = state.productos
                .filter(product => product._id !== action.payload._id)
            const remainingCustomProducts = remainingProducts
                .filter(product => product._id.startsWith('customProduct_'))
                .map((product, index) => {
                    const fixedCustomProduct = {
                        ...product,
                        _id: 'customProduct_' + (1 + index),
                        codigoBarras: 'customProduct_' + (1 + index),
                        key: 'customProduct_' + (1 + index)
                    }
                    return fixedCustomProduct
                })
            const remainingNoCustomProducts = remainingProducts
                .filter(product => !product._id.startsWith('customProduct_'))
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'products',
                    timesModified: state.lastModifiedParameter.parameter === 'products'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                productos: [...remainingCustomProducts, ...remainingNoCustomProducts]
            }
        case actions.SET_CLIENT:
            return {
                ...state,
                cliente: action.payload,
                clienteRazonSocial: action.payload?.razonSocial ?? null,
                clienteDireccion: action.payload?.direccion ?? null,
                clienteIdentificador: action.payload?.cuit ?? null,
                clienteCondicionIva: action.payload?.condicionFiscal?.nombre ?? null,
                clienteDocumentoReceptor: action.payload?.documentoReceptor ?? null,
                selectClient: {
                    ...state.selectClient,
                    selectedValue: action.payload?.razonSocial ?? null
                }
            }
        case actions.SET_COMPANY:
            return {
                ...state,
                empresa: action.payload,
                empresaRazonSocial: action.payload?.razonSocial ?? null,
                empresaDireccion: action.payload?.direccion ?? null,
                empresaCondicionIva: action.payload?.condicionFiscal?.nombre ?? null,
                empresaCuit: action.payload?.cuit ?? null,
                empresaIngresosBrutos: action.payload?.ingresosBrutos ?? null,
                empresaInicioActividad: action.payload?.fechaInicioActividad ?? null,
                empresaLogo: action.payload?.logo?.url ?? null
            }
        case actions.SET_DATES:
            return {
                ...state,
                fechaEmision: action.payload,
                fechaEmisionString: simpleDateWithHours(action.payload),
                valueForDatePicker: dayjs(localFormat(action.payload), 'DD/MM/YYYY')
            }
        case actions.SET_DOCUMENT:
            return {
                ...state,
                documento: action.payload,
                documentoLetra: action.payload?.letra ?? null,
                documentoFiscal: action.payload?.fiscal ?? null,
                documentoCodigo: action.payload?.codigoUnico ?? null,
                documentoDocumentoReceptor: action.payload?.documentoReceptor ?? null,
                selectDocument: {
                    ...state.selectDocument,
                    selectedValue: action.payload?.nombre ?? null
                }
            }
        case actions.SET_FRACTIONED:
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'lineFractioned',
                    timesModified: state.lastModifiedParameter.parameter === 'lineFractioned'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                renglones: state.renglones.map(line => {
                    const lineProduct = state.productos.find(product => product._id === line._id)
                    const productUnfractionedProfit = lineProduct.gananciaNeta
                    const productFractionedProfit = lineProduct.gananciaNetaFraccionado / lineProduct.unidadMedida.fraccionamiento
                    if (line._id === action.payload._id) {
                        line.cantidadUnidades = (action.payload.fraccionar && action.payload.fraccionamiento >= 1000) ? 1000 : 1
                        line.fraccionar = action.payload.fraccionar
                        line.profit = action.payload.fraccionar
                            ? productFractionedProfit * action.payload.cantidadUnidades
                            : productUnfractionedProfit * action.payload.cantidadUnidades
                    }
                    return line
                })
            }
        case actions.SET_GENERAL_PERCENTAGE:
            const isValidValue = (!action.payload?.toString()?.endsWith('.') && !action.payload?.toString()?.endsWith(',')) ?? false
            const isDiscount = state.generalPercentageType === 'discount'
            const isSurcharge = state.generalPercentageType === 'surcharge'
            const existsValue = action.payload && action.payload !== ''
            return {
                ...state,
                generalPercentage: existsValue ? action.payload : null,
                lastModifiedParameter: {
                    parameter: 'generalPercentage',
                    timesModified: state.lastModifiedParameter.parameter === 'generalPercentage'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                porcentajeDescuentoGlobal: (isDiscount && existsValue && isValidValue) ? action.payload : null,
                porcentajeRecargoGlobal: (isSurcharge && existsValue && isValidValue) ? action.payload : null
            }
        case actions.SET_INDEX:
            return {
                ...state,
                indice: action.payload
            }
        case actions.SET_LINE_DISCOUNT_PERCENTAGE:
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'lineDiscount',
                    timesModified: state.lastModifiedParameter.parameter === 'lineDiscount'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                renglones: state.renglones.map(line => {
                    if (line._id === action.payload._id) line.porcentajeDescuentoRenglon = action.payload.porcentajeDescuentoRenglon
                    return line
                })
            }
        case actions.SET_LINE_NOTE:
            return {
                ...state,
                renglones: state.renglones.map(line => {
                    if (line._id === action.payload.lineID) line.nota = action.payload.note
                    return line
                })
            }
        case actions.SET_LINE_QUANTITY:
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'lineQuantity',
                    timesModified: state.lastModifiedParameter.parameter === 'lineQuantity'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                renglones: state.renglones.map(line => {
                    if (line._id === action.payload._id) line.cantidadUnidades = action.payload.cantidadUnidades
                    return line
                })
            }
        case actions.SET_LINE_SURCHARGE_PERCENTAGE:
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'lineSurcharge',
                    timesModified: state.lastModifiedParameter.parameter === 'lineSurcharge'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                renglones: state.renglones.map(line => {
                    if (line._id === action.payload._id) line.porcentajeRecargoRenglon = action.payload.porcentajeRecargoRenglon
                    return line
                })
            }
        case actions.SET_LINES:
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'lines',
                    timesModified: state.lastModifiedParameter.parameter === 'lines'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                renglones: action.payload.map(line => {
                    const isCustomLine = line._id.startsWith('customProduct_')
                    const unitMeasureInlcudesKilograms = line?.unidadMedida?.nombre.toLowerCase().includes('kilo') ?? null
                    const unitMeasureInlcudesGrams = line?.unidadMedida?.nombre.toLowerCase().includes(' gramo') ?? null
                    const isUnitMeasureGramsToGrams = (!unitMeasureInlcudesKilograms && unitMeasureInlcudesGrams) ? true : false

                    const fractionament = !line.unidadMedida ? 1 : line.unidadMedida.fraccionamiento
                    const productUnitOfMeasure = !line.unidadMedida
                        ? null
                        : action.payload.find(item => item._id === line._id).unidadMedida.nombre

                    const linePresent = state.renglones
                        .filter(renglon => !renglon._id.startsWith('customProduct_'))
                        .find(renglon => renglon._id === line._id)
                    if (linePresent) return linePresent

                    const formattedLine = {
                        _id: line._id,
                        cantidadAgregadaPorDescuento_enKg: 0,
                        cantidadg: isCustomLine ? 0 : isUnitMeasureGramsToGrams ? fractionament : 0,
                        cantidadKg: isCustomLine ? 0 : isUnitMeasureGramsToGrams ? 0 : (fractionament < 1000) ? fractionament : 1,
                        cantidadQuitadaPorRecargo_enKg: 0,
                        cantidadUnidades: fractionament < 1000 ? '1' : '1000',
                        codigoBarras: line.codigoBarras,
                        descuento: 0,
                        fraccionamiento: fractionament,
                        fraccionar: fractionament > 1 ? true : false,
                        importeIva: line?.ivaVenta ?? 0,
                        key: line._id,
                        nombre: line.nombre,
                        nota: '',
                        porcentajeDescuentoRenglon: null,
                        porcentajeIva: line?.porcentajeIvaVenta ?? 0,
                        porcentajeRecargoRenglon: null,
                        precioBruto: isCustomLine ? line.precioVenta : fractionament ? line.precioVentaFraccionado : line.precioVenta,
                        precioNeto: isCustomLine ? line.precioVenta : fractionament ? line.precioVentaFraccionado : line.precioVenta,
                        precioNetoFijo: false,
                        precioUnitario: isCustomLine ? line.precioVenta : fractionament ? line.precioVentaFraccionado : line.precioVenta,
                        profit: line.profit ? line.profit : fractionament ? line.gananciaNetaFraccionado : line.gananciaNeta,
                        recargo: 0,
                        unidadMedida: productUnitOfMeasure
                    }

                    return formattedLine
                })
            }
        case actions.SET_NET_PRICE:
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'lineNetPrice',
                    timesModified: state.lastModifiedParameter.parameter === 'lineNetPrice'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                renglones: state.renglones.map(line => {
                    if (line._id === action.payload._id) line.precioNeto = action.payload.precioNeto
                    return line
                })
            }
        case actions.SET_NET_PRICE_FIXED:
            return {
                ...state,
                renglones: state.renglones.map(line => {
                    if (line._id === action.payload._id) line.precioNetoFijo = action.payload.precioNetoFijo
                    return line
                })
            }
        case actions.SET_PAYMENT_METHOD:
            const paymentMethodNames = action.payload.map(paymentMethod => paymentMethod.nombre)
            const paymentMethodName = paymentMethodNames.length === 0 ? null : paymentMethodNames[0]
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'paymentMethod',
                    timesModified: state.lastModifiedParameter.parameter === 'paymentMethod'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                mediosPago: action.payload.map(paymentMethod => paymentMethod._id),
                mediosPagoNombres: paymentMethodNames,
                selectPaymentMethod: {
                    ...state.selectPaymentMethod,
                    selectedValue: paymentMethodName
                }
            }
        case actions.SET_PAYMENT_PLAN:
            const paymentPlansNames = action.payload.map(paymentPlan => paymentPlan.nombre)
            const paymentPlanName = paymentPlansNames.length === 0 ? null : paymentPlansNames[0]
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'paymentPlan',
                    timesModified: state.lastModifiedParameter.parameter === 'paymentPlan'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                planesPago: action.payload,
                planesPagoNombres: paymentPlansNames,
                selectPaymentPlan: {
                    ...state.selectPaymentPlan,
                    selectedValue: paymentPlanName
                }
            }
        case actions.SET_PRODUCT:
            return {
                ...state,
                lastModifiedParameter: {
                    parameter: 'products',
                    timesModified: state.lastModifiedParameter.parameter === 'products'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                productos: [...state.productos, action.payload]
            }
        case actions.SET_SALE_POINT:
            return {
                ...state,
                puntoVenta: action.payload,
                puntoVentaNumero: action.payload.numero,
                puntoVentaNombre: action.payload.nombre
            }
        case actions.SET_USER:
            return {
                ...state,
                usuario: action.payload
            }
        case actions.SET_VOUCHER_NUMBERS:
            return {
                ...state,
                numeroFactura: action.payload,
                numeroCompletoFactura: formatToCompleteVoucherNumber(state.puntoVentaNumero, action.payload)
            }

        default:
            return state
    }
}

const sale = {
    initialState,
    actions,
    reducer
}

export default sale