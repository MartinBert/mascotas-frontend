import stringHelper from './stringHelper'


const cuitParser = (value) => {
    const stringValue = value.toString()
    if (!stringValue) return value
    const parsedValue = stringValue.replace(stringHelper.regExp.ifNotNumber, '')
    return parsedValue
}

const extractValuesFromParams = (params) => {
    const paramsAreArray = Array.isArray(params)
    const paramsAreObject = typeof params === 'object' && !Array.isArray(params)
    let paramsValues = {}
    if (paramsAreArray) {
        for (let index = 0; index < params.length; index++) {
            const firstProp = Object.keys(params[index])[0]
            const param = params[index]
            paramsValues[firstProp] = param.value
        }
    } else if (paramsAreObject) {
        const objKeys = Object.keys(params)
        const objValues = Object.values(params).map(data => data.value)
        for (let index = 0; index < objKeys.length; index++) {
            const key = objKeys[index]
            const value = objValues[index]
            paramsValues[key] = value
        }
    } else {
        paramsValues = 'params must be an Array or Object.'
    }
    return paramsValues
}

const grossIncomeParser = (value) => {
    const stringValue = value.toString()
    if (!stringValue) return value
    const parsedValue = stringValue.replace(stringHelper.regExp.ifNotNumber, '')
    return parsedValue
}

const phoneParser = (value) => {
    const stringValue = value.toString()
    if (!stringValue) return value
    const parsedValue = stringValue.replace(stringHelper.regExp.ifNotNumber, '')
    return parsedValue
}

const salePointNumberParser = (value) => {
    const stringValue = value.toString()
    if (!stringValue) return value
    const parsedValue = stringValue.replace(stringHelper.regExp.ifNotNumber, '')
    return parsedValue
}

const dataParserHelper = {
    cuitParser,
    extractValuesFromParams,
    grossIncomeParser,
    phoneParser,
    salePointNumberParser
}

export default dataParserHelper