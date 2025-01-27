// Helpers
import helpers from '../helpers'

// Imports Destructuring
const { formatToCompleteVoucherNumber, getReferenceVoucher } = helpers.afipHelper
const { simpleDateWithHours } = helpers.dateHelper
const { round } = helpers.mathHelper


const actions = {
    CALCULATE_IVA: 'CALCULATE_IVA',
    CLEAR_INPUTS: 'CLEAR_INPUTS',
    CLEAR_STATE: 'CLEAR_STATE',
    HIDE_FISCAL_NOTE_MODAL: 'HIDE_FISCAL_NOTE_MODAL',
    GENERATE_AFIP_REQUEST_DATA: 'GENERATE_AFIP_REQUEST_DATA',
    SET_ALL_PAYMENT_METHODS: 'SET_ALL_PAYMENT_METHODS',
    SET_ALL_PAYMENT_PLANS: 'SET_ALL_PAYMENT_PLANS',
    SET_CREDIT_NOTE: 'SET_CREDIT_NOTE',
    SET_DEBIT_NOTE: 'SET_DEBIT_NOTE',
    SET_FISCAL_NOTE_NUMBER: 'SET_FISCAL_NOTE_NUMBER',
    SET_LOADING_FISCAL_NOTE: 'SET_LOADING_FISCAL_NOTE',
    SET_LOADING_PAYMENT_METHOD: 'SET_LOADING_PAYMENT_METHOD',
    SET_LOADING_PAYMENT_PLAN: 'SET_LOADING_PAYMENT_PLAN',
    SET_LOADING_SAVING_OPERATION: 'SET_LOADING_SAVING_OPERATION',
    SET_REFERENCE_VOUCHER: 'SET_REFERENCE_VOUCHER',
    SET_RENDER_CONDITION: 'SET_RENDER_CONDITION',
    SET_USER: 'SET_USER',
    SET_VALUES: 'SET_VALUES',
    SHOW_FISCAL_NOTE_MODAL: 'SHOW_FISCAL_NOTE_MODAL'
}

const initialState = {
    afipRequestData: null,
    allPaymentMethods: [],
    allPaymentMethodsNames: [],
    allPaymentPlans: [],
    allPaymentPlansNames: [],
    creditNote: null,
    debitNote: null,
    fiscalNoteModalIsVisible: false,
    isRenderable: true,
    loadingFiscalNote: false,
    loadingPaymentMethod: false,
    loadingSavingOperation: false,

    /* Data for Fiscal Notes controllers */
    params: {
        amountDifference: 0,
        amountGross: 0,
        amountNet: 0,
        amountRounded: 0,
        associatedVouchers: [],
        business: null,
        businessAddress: null,
        businessCuit: null,
        businessGrossIncomes: null,
        businessIvaCondition: null,
        businessLogo: null,
        businessName: null,
        businessStartOfActivities: null,
        client: null,
        clientName: null,
        clientAddress: null,
        clientIdentifier: null,
        clientIvaCondition: null,
        clientReceiverDocument: null,
        concept: '',
        date: new Date(),
        dateString: simpleDateWithHours(new Date()),
        fiscalNote: null,
        fiscalNoteLetter: '',
        fiscalNoteNumber: 0,
        fiscalNoteNumberComplete: '',
        index: 0,
        iva: [],
        iva10: 0,
        iva21: 0,
        iva27: 0,
        ivaTaxBase10: 0,
        ivaTaxBase21: 0,
        ivaTaxBase27: 0,
        ivaTotal: 0,
        isFiscal: true,
        paymentMethod: null,
        paymentMethodName: null,
        paymentPlan: null,
        paymentPlanName: null,
        profit: 0,
        referenceVoucher: {
            clienteRazonSocial: '',
            fechaEmisionString: '',
            total: 0
        },
        salePoint: null,
        salePointName: null,
        salePointNumber: null,
        subAmount: 0,
        user: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.CALCULATE_IVA:
            const proportion = state.params.amountNet / getReferenceVoucher(state).total
            const iva = [
                {
                    Id: 4,
                    BaseImp: round(proportion * getReferenceVoucher(state).baseImponible10),
                    Importe: round(proportion * getReferenceVoucher(state).iva10)
                },
                {
                    Id: 5,
                    BaseImp: round(proportion * getReferenceVoucher(state).baseImponible21),
                    Importe: round(proportion * getReferenceVoucher(state).iva21)
                },
                {
                    Id: 6,
                    BaseImp: round(proportion * getReferenceVoucher(state).baseImponible27),
                    Importe: round(proportion * getReferenceVoucher(state).iva27)
                }
            ]
            const ivaTotal = iva.reduce((accumulator, currentValue) => accumulator + currentValue.Importe, 0)
            return {
                ...state,
                params: {
                    ...state.params,
                    iva: iva,
                    iva10: iva[0].Importe,
                    iva21: iva[1].Importe,
                    iva27: iva[2].Importe,
                    ivaTaxBase10: iva[0].BaseImp,
                    ivaTaxBase21: iva[1].BaseImp,
                    ivaTaxBase27: iva[2].BaseImp,
                    ivaTotal: ivaTotal,
                    subAmount: round(state.params.amountNet - ivaTotal)
                }
            }
        case actions.CLEAR_INPUTS:
            return {
                ...state,
                isRenderable: true,
                params: {
                    ...state.params,
                    amountDifference: 0,
                    amountGross: 0,
                    amountNet: 0,
                    amountRounded: 0,
                    concept: '',
                    fiscalNote: null,
                    fiscalNoteLetter: '',
                    fiscalNoteNumber: 0,
                    fiscalNoteNumberComplete: '',
                    index: 0,
                    iva: [],
                    iva10: 0,
                    iva21: 0,
                    iva27: 0,
                    ivaTaxBase21: 0,
                    ivaTaxBase10: 0,
                    ivaTaxBase27: 0,
                    ivaTotal: 0,
                    paymentMethod: null,
                    paymentMethodName: null,
                    paymentPlan: null,
                    paymentPlanName: null,
                    subAmount: 0
                }
            }
        case actions.CLEAR_STATE:
            return initialState
        case actions.HIDE_FISCAL_NOTE_MODAL:
            return {
                ...state,
                fiscalNoteModalIsVisible: false
            }
        case actions.GENERATE_AFIP_REQUEST_DATA:
            return {
                ...state,
                afipRequestData: {
                    clienteIdentificador: getReferenceVoucher(state).clienteIdentificador,
                    clienteDocumentoReceptor: getReferenceVoucher(state).clienteDocumentoReceptor,
                    comprobantesAsociados: {
                        Cuit: getReferenceVoucher(state).empresaCuit,
                        Tipo: state.params.fiscalNote ? state.params.fiscalNote.codigoUnico : null,
                        PtoVta: getReferenceVoucher(state).puntoVentaNumero,
                        Nro: state.params.fiscalNoteNumber
                    },
                    documentoCodigo: state.params.fiscalNote ? state.params.fiscalNote.codigoUnico : null,
                    documentoLetra: state.params.fiscalNote ? state.params.fiscalNote.letra : null,
                    facturaReferenciaCodigo: parseInt(getReferenceVoucher(state).documentoCodigo),
                    facturaReferenciaNumero: getReferenceVoucher(state).numeroFactura,
                    fechaEmision: new Date(),
                    importeIva: state.params.ivaTotal,
                    iva: state.params.iva,
                    numeroFactura: state.params.fiscalNoteNumber,
                    puntoVentaNumero: getReferenceVoucher(state).puntoVentaNumero,
                    subTotal: state.params.amountNet - state.params.ivaTotal,
                    total: state.params.amountNet
                }
            }
        case actions.SET_FISCAL_NOTE_NUMBER:
            return {
                ...state,
                params: {
                    ...state.params,
                    fiscalNoteNumberComplete: formatToCompleteVoucherNumber(
                        state.params.salePointNumber,
                        state.params.fiscalNoteNumber
                    ),
                    fiscalNoteNumber: action.payload,
                    index: action.payload
                }
            }
        case actions.SET_CREDIT_NOTE:
            return {
                ...state,
                creditNote: action.payload
            }
        case actions.SET_DEBIT_NOTE:
            return {
                ...state,
                debitNote: action.payload
            }
        case actions.SET_LOADING_FISCAL_NOTE:
            return {
                ...state,
                loadingFiscalNote: action.payload
            }
        case actions.SET_LOADING_PAYMENT_METHOD:
            return {
                ...state,
                loadingPaymentMethod: action.payload
            }
        case actions.SET_LOADING_SAVING_OPERATION:
            return {
                ...state,
                loadingSavingOperation: action.payload
            }
        case actions.SET_ALL_PAYMENT_METHODS:
            return {
                ...state,
                allPaymentMethods: action.payload.paymentMethods,
                allPaymentMethodsNames: action.payload.paymentMethodsNames
            }
        case actions.SET_ALL_PAYMENT_PLANS:
            return {
                ...state,
                allPaymentPlans: action.payload.paymentPlans,
                allPaymentPlansNames: action.payload.paymentPlansNames
            }
        case actions.SET_REFERENCE_VOUCHER:
            return {
                ...state,
                params: {
                    ...state.params,
                    associatedVouchers: [{
                        Tipo: parseInt(action.payload.documentoCodigo),
                        PtoVta: parseInt(action.payload.puntoVentaNumero),
                        Nro: parseInt(action.payload.numeroFactura),
                        Cuit: parseInt(action.payload.empresaCuit)
                    }],
                    business: action.payload.empresa,
                    businessAddress: action.payload.empresaDireccion,
                    businessCuit: action.payload.empresaCuit,
                    businessGrossIncomes: action.payload.empresaIngresosBrutos,
                    businessIvaCondition: action.payload.empresaCondicionIva,
                    businessLogo: action.payload.empresaLogo,
                    businessName: action.payload.empresaRazonSocial,
                    businessStartOfActivities: action.payload.empresaInicioActividad,
                    client: action.payload.cliente,
                    clientName: action.payload.clienteRazonSocial,
                    clientAddress: action.payload.clienteDireccion,
                    clientIdentifier: action.payload.clienteIdentificador,
                    clientIvaCondition: action.payload.clienteCondicionIva,
                    clientReceiverDocument: action.payload.clienteDocumentoReceptor,
                    referenceVoucher: action.payload,
                    salePoint: action.payload.puntoVenta,
                    salePointName: action.payload.puntoVentaNombre,
                    salePointNumber: action.payload.puntoVentaNumero
                }
            }
        case actions.SET_RENDER_CONDITION:
            return {
                ...state,
                isRenderable: action.payload
            }
        case actions.SET_USER:
            return {
                ...state,
                params: {
                    ...state.params,
                    user: action.payload
                }
            }
        case actions.SET_VALUES:
            return {
                ...state,
                params: {
                    ...state.params,
                    amountGross: round(action.payload.amountGross),
                    amountNet: round(action.payload.amountNet),
                    amountDifference: round(action.payload.amountDifference),
                    amountRounded: round(action.payload.amountRounded),
                    concept: action.payload.concept,
                    fiscalNote: action.payload.fiscalNote,
                    fiscalNoteCode: action.payload.fiscalNote ? action.payload.fiscalNote.codigoUnico : null,
                    fiscalNoteLetter: action.payload.fiscalNote ? action.payload.fiscalNote.letra : null,
                    paymentMethod: action.payload.paymentMethod,
                    paymentMethodName: action.payload.paymentMethodName,
                    paymentPlan: action.payload.paymentPlan,
                    paymentPlanName: action.payload.paymentPlanName
                }
            }
        case actions.SHOW_FISCAL_NOTE_MODAL:
            return {
                ...state,
                fiscalNoteModalIsVisible: true
            }
        default:
            return state;
    }
}

const fiscalNoteModal = {
    initialState,
    actions,
    reducer
}

export default fiscalNoteModal