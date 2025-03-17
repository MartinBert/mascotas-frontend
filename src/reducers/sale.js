// Design Components
import dayjs from 'dayjs'

// Helpers
import helpers from '../helpers'

const { formatToCompleteVoucherNumber } = helpers.afipHelper
const { afipDateToLocalFormat, localFormat, simpleDateWithHours } = helpers.dateHelper
const { updateLinesValues, updateTotals } = helpers.saleHelper


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
        lineId: null,
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
    receiverIvaCondition: 0,
    renglones: [],
    subTotal: 0,
    total: 0,
    totalDescuento: 0,
    totalRecargo: 0,
    usuario: null,
    vencimientoCae: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        // ---------------- Actions of events ---------------- //
        case actions.CLOSE_FISCAL_OPERATION:
            return {
                ...state,
                cae: action.payload.CAE,
                vencimientoCae: afipDateToLocalFormat(action.payload.CAEFchVto),
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
                    lineId: null,
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
                receiverIvaCondition: action.payload?.receiverIvaCondition ?? 0,
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
                    lineId: action.payload._id,
                    parameter: 'lineFractionated',
                    timesModified: state.lastModifiedParameter.parameter === 'lineFractionated'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                renglones: state.renglones.map(line => {
                    if (line._id === action.payload._id) {
                        line.fraccionar = action.payload.fraccionar
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
                    lineId: null,
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
                    lineId: action.payload._id,
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
                    lineId: action.payload._id,
                    parameter: 'lineQuantity',
                    timesModified: state.lastModifiedParameter.parameter === 'lineQuantity'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                renglones: state.renglones.map(line => {
                    if (line._id === action.payload._id) {
                        line.cantidadUnidades = action.payload.cantidadUnidades
                        line.cantidadUnidadesFraccionadas = action.payload.cantidadUnidadesFraccionadas
                    }
                    return line
                })
            }
        case actions.SET_LINE_SURCHARGE_PERCENTAGE:
            return {
                ...state,
                lastModifiedParameter: {
                    lineId: action.payload._id,
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
            const linesSet = action.payload.map(line => {
                const lineAlreadyExistent = state.renglones
                    .filter(renglon => !renglon._id.startsWith('customProduct_'))
                    .find(renglon => renglon._id === line._id)

                let formattedLine = {}
                if (lineAlreadyExistent) {
                    formattedLine = lineAlreadyExistent
                } else {
                    const fractionament = line?.unidadMedida?.fraccionamiento ?? 1
                    const isCustomLine = line._id.startsWith('customProduct_')
                    const isLineFractionable = line?.unidadMedida?.fraccionamiento >= 1000 ?? null
                    const productUnitOfMeasure = line.unidadMedida ?? null
                    const unitMeasureInlcudesKilograms = line?.unidadMedida?.nombre.toLowerCase().includes('kilo') ?? null
                    const unitMeasureInlcudesGrams = line?.unidadMedida?.nombre.toLowerCase().includes(' gramo') ?? null
                    const unitMeasureInlcudesGrOrKg = (unitMeasureInlcudesGrams || unitMeasureInlcudesKilograms) ?? false
                    const isUnitMeasureGrToGr = (!unitMeasureInlcudesKilograms && unitMeasureInlcudesGrams) ? true : false
                    const productFractionedQuantity = (
                        !isLineFractionable
                            ? (line.unidadMedida.fraccionamiento).toString()
                            : fractionament >= 1000
                                ? '1000'
                                : (fractionament >= 100 && fractionament < 1000)
                                    ? '100'
                                    : '1'
                    )
                    const productQuantity = (
                        !isLineFractionable
                            ? '1'
                            : fractionament >= 1000
                                ? (1000 / line.unidadMedida.fraccionamiento).toString()
                                : (fractionament >= 100 && fractionament < 1000)
                                    ? (100 / line.unidadMedida.fraccionamiento).toString()
                                    : (1 / line.unidadMedida.fraccionamiento).toString()
                    )
                    formattedLine = {
                        _id: line._id,
                        cantidadAgregadaPorDescuento_enKg: 0,
                        cantidadg: (isCustomLine || !unitMeasureInlcudesGrOrKg) ? 0 : isUnitMeasureGrToGr ? fractionament : 0,
                        cantidadKg: (isCustomLine || !unitMeasureInlcudesGrOrKg) ? 0 : isUnitMeasureGrToGr ? 0 : (fractionament < 1000) ? fractionament : 1,
                        cantidadQuitadaPorRecargo_enKg: 0,
                        cantidadUnidades: productQuantity,
                        cantidadUnidadesFraccionadas: productFractionedQuantity,
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
                        precioBruto: isCustomLine ? line.precioVenta : ((fractionament > 1 ? line.precioVentaFraccionado : line.precioVenta) * productQuantity),
                        precioListaUnitario: isCustomLine ? 0 : line.precioUnitario,
                        precioNeto: isCustomLine ? line.precioVenta : ((fractionament > 1 ? line.precioVentaFraccionado : line.precioVenta) * productQuantity),
                        precioNetoFijo: false,
                        precioUnitario: isCustomLine ? line.precioVenta : fractionament > 1 ? line.precioVentaFraccionado : line.precioVenta,
                        productId: line._id,
                        profit: (fractionament > 1 ? line.gananciaNetaFraccionado : line.gananciaNeta) * productQuantity,
                        recargo: 0,
                        unidadMedida: productUnitOfMeasure
                    }
                }
                return formattedLine
            })
            return {
                ...state,
                lastModifiedParameter: {
                    lineId: null,
                    parameter: 'lines',
                    timesModified: state.lastModifiedParameter.parameter === 'lines'
                        ? state.lastModifiedParameter.timesModified + 1
                        : 0
                },
                renglones: linesSet
            }
        case actions.SET_NET_PRICE:
            return {
                ...state,
                lastModifiedParameter: {
                    lineId: action.payload._id,
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
                    lineId: null,
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
                    lineId: null,
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