import stringHelper from './stringHelper'


const cuitParser = (value) => {
    const stringValue = value.toString()
    if (!stringValue) return value
    const parsedValue = stringValue.replace(stringHelper.regExp.ifNotNumber, '')
    return parsedValue
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
    grossIncomeParser,
    phoneParser,
    salePointNumberParser
}

export default dataParserHelper