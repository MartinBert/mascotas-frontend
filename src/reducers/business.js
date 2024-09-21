import dayjs from 'dayjs'

const addParameters = (payload) => {
    const obj = {}
    if (typeof payload.datePickerValue !== 'undefined') obj.datePickerValue = payload.datePickerValue
    if (typeof payload.fieldStatus !== 'undefined') obj.fieldStatus = payload.fieldStatus
    if (typeof payload.value !== 'undefined') obj.value = payload.value
    return obj
}

const parseValueToArray = (obj) => {
    if (typeof obj.value !== 'undefined') {
        if (!obj.value || obj.value === '') obj.value = []
        else obj.value = [obj.value]
    }
    return obj
}

const parseValueToDatePicker = (obj) => {
    if (obj.datePickerValue) {
        if (obj.datePickerValue === '') obj.datePickerValue = ''
        else obj.datePickerValue = dayjs(obj.datePickerValue, 'DD-MM-YYYY')
    }
    return obj
}


const actions = {
    SET_ACTIVITY_DESCRIPTION: 'SET_ACTIVITY_DESCRIPTION',
    SET_ADDRESS: 'SET_ADDRESS',
    SET_BUSINESS_NAME: 'SET_BUSINESS_NAME',
    SET_CUIT: 'SET_CUIT',
    SET_EMAIL: 'SET_EMAIL',
    SET_FISCAL_CONDITION: 'SET_FISCAL_CONDITION',
    SET_GROSS_INCOME: 'SET_GROSS_INCOME',
    SET_LOGO: 'SET_LOGO',
    SET_PHONE: 'SET_PHONE',
    SET_SALE_POINT: 'SET_SALE_POINT',
    SET_START_ACTIVITIES_DATE: 'SET_START_ACTIVITIES_DATE',
}

const initialState = {
    params: {
        activityDescription: { fieldStatus: null, value: null },
        address: { fieldStatus: null, value: null },
        businessName: { fieldStatus: null, value: null },
        cuit: { fieldStatus: null, value: null },
        email: { fieldStatus: null, value: null },
        fiscalCondition: { fieldStatus: null, value: null },
        grossIncome: { fieldStatus: null, value: null },
        logo: { fieldStatus: null, value: null },
        phone: { fieldStatus: null, value: null },
        salePoint: { fieldStatus: null, value: null },
        startActivityDate: { datePickerValue: '', fieldStatus: null, value: null }
    },
    selectFiscalCondition: {
        options: [],
        selectedValue: null
    },
    selectSalePoint: {
        options: [],
        selectedValue: null
    }
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_ACTIVITY_DESCRIPTION:
            const businessActivityDescriptionObj = addParameters(action.payload)
            return {
                ...state,
                params: {
                    ...state.params,
                    activityDescription: {
                        ...state.params.activityDescription,
                        ...businessActivityDescriptionObj
                    }
                }
            }
        case actions.SET_ADDRESS:
            const businessAddressObj = addParameters(action.payload)
            return {
                ...state,
                params: {
                    ...state.params,
                    address: {
                        ...state.params.address,
                        ...businessAddressObj
                    }
                }
            }
        case actions.SET_BUSINESS_NAME:
            const businessNameObj = addParameters(action.payload)
            return {
                ...state,
                params: {
                    ...state.params,
                    businessName: {
                        ...state.params.businessName,
                        ...businessNameObj
                    }
                }
            }
        case actions.SET_CUIT:
            const businessCuitObj = addParameters(action.payload)
            return {
                ...state,
                params: {
                    ...state.params,
                    cuit: {
                        ...state.params.cuit,
                        ...businessCuitObj
                    }
                }
            }
        case actions.SET_EMAIL:
            const businessEmailObj = addParameters(action.payload)
            return {
                ...state,
                params: {
                    ...state.params,
                    email: {
                        ...state.params.email,
                        ...businessEmailObj
                    }
                }
            }
        case actions.SET_FISCAL_CONDITION:
            const businessFiscalConditionObj = addParameters(action.payload)
            return {
                ...state,
                params: {
                    ...state.params,
                    fiscalCondition: {
                        ...state.params.fiscalCondition,
                        ...businessFiscalConditionObj
                    }
                }
            }
        case actions.SET_GROSS_INCOME:
            const businessGrossIncomeObj = addParameters(action.payload)
            return {
                ...state,
                params: {
                    ...state.params,
                    grossIncome: {
                        ...state.params.grossIncome,
                        ...businessGrossIncomeObj
                    }
                }
            }
        case actions.SET_LOGO:
            const businessLogoObj = addParameters(action.payload)
            return {
                ...state,
                params: {
                    ...state.params,
                    logo: {
                        ...state.params.logo,
                        ...businessLogoObj
                    }
                }
            }
        case actions.SET_PHONE:
            const businessPhoneObj = addParameters(action.payload)
            return {
                ...state,
                params: {
                    ...state.params,
                    phone: {
                        ...state.params.phone,
                        ...businessPhoneObj
                    }
                }
            }
        case actions.SET_SALE_POINT:
            const businessSalePointObj = addParameters(action.payload)
            const parsedBusinessSalePointObj = parseValueToArray(businessSalePointObj)
            return {
                ...state,
                params: {
                    ...state.params,
                    salePoint: {
                        ...state.params.salePoint,
                        ...parsedBusinessSalePointObj
                    }
                }
            }
        case actions.SET_START_ACTIVITIES_DATE:
            const businessStartActivitiesDateObj = addParameters(action.payload)
            const parsedBusinessStartActivitiesDateObj = parseValueToDatePicker(businessStartActivitiesDateObj)
            return {
                ...state,
                params: {
                    ...state.params,
                    startActivityDate: {
                        ...state.params.startActivityDate,
                        ...parsedBusinessStartActivitiesDateObj
                    }
                }
            }
        default:
            return state
    }
}

const business = {
    actions,
    initialState,
    reducer
}

export default business