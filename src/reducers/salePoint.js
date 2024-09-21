const addParameters = (payload) => {
    const obj = {}
    if (typeof payload.datePickerValue !== 'undefined') obj.datePickerValue = payload.datePickerValue
    if (typeof payload.fieldStatus !== 'undefined') obj.fieldStatus = payload.fieldStatus
    if (typeof payload.value !== 'undefined') obj.value = payload.value
    return obj
}

const parseValueToNumber = (obj) => {
    if (obj.value) {
        if (obj.value === '') obj.value = ''
        else obj.value = parseInt(obj.value)
    }
    return obj
}


const actions = {
    SET_NAME: 'SET_NAME',
    SET_NUMBER: 'SET_NUMBER',
}

const initialState = {
    params: {
        name: { fieldStatus: null, value: null },
        number: { fieldStatus: null, value: null }
    }
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_NAME:
            const salePointNameObj = addParameters(action.payload)
            return {
                ...state,
                params: {
                    ...state.params,
                    name: {
                        ...state.params.name,
                        ...salePointNameObj
                    }
                }
            }
        case actions.SET_NUMBER:
            const salePointNumberObj = addParameters(action.payload)
            const parsedSalePointNumberObj = parseValueToNumber(salePointNumberObj)
            
            return {
                ...state,
                params: {
                    ...state.params,
                    number: {
                        ...state.params.number,
                        ...parsedSalePointNumberObj
                    }
                }
            }
        default:
            return state
    }
}

const salePoint = {
    actions,
    initialState,
    reducer
}

export default salePoint