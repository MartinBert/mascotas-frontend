const completeLengthWithZero = (value, length) => {
    const cicles = length - value.toString().length
    if (cicles <= 0) return value
    for (let i = 0; i < cicles; i++) {
        value = '0' + value
    }
    return value
}

const countDecimalPlaces = (stringValue) => {
    const pointPosition = stringValue.indexOf('.')
    if (pointPosition === -1) return 0
    const lastDecimalPosition = stringValue.length - 1
    const numberOfDecimalPlaces = lastDecimalPosition - pointPosition
    return numberOfDecimalPlaces
}

const normalizeString = (string) => {
    const normalizeString = string.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    return normalizeString
}

const regExp = {
    ifNotNumber: /\D/gm,
    // eslint-disable-next-line
    ifNotNumbersOrBar: /[^0-9\/]/gm,
    ifNotNumbersCommaAndPoint: /[^0-9,.]/gm,
    ifSpecialCharacter: /\W/gm
}

// Fixed commas and points of input number values
const fixInputNumber = (currentValue, prevValue) => {
    if (!currentValue || currentValue === '') return ''

    // Data
    let currentValueString = currentValue.toString()
    const prevValueString = prevValue ? prevValue.toString() : ''
    currentValueString = currentValueString.replace(regExp.ifNotNumbersCommaAndPoint, '').replace(',', '.')
    const previousValueAlreadyContainsAPoint = prevValueString.includes('.')
    const endsWithPoint = currentValueString.endsWith('.')
    // Conditions
    const decimalPlacesOfcurrentValue = countDecimalPlaces(currentValueString)
    const existsTwoPoints = previousValueAlreadyContainsAPoint && endsWithPoint && !(prevValueString.length > currentValueString.length)
    const startsWithPoint = currentValueString.startsWith('.')
    const zeroOnLeft = currentValueString.startsWith('0') && !currentValueString.substring(0, 2).includes('.') && currentValueString.length > 1
    const zeroOnRight = currentValueString.endsWith('0') && decimalPlacesOfcurrentValue === 2
    // Evaluate
    if (startsWithPoint) currentValueString = '0' + currentValueString
    if (zeroOnLeft) currentValueString = currentValueString.substring(1)
    if (decimalPlacesOfcurrentValue > 2 || existsTwoPoints || zeroOnRight)
        currentValueString = currentValueString.substring(0, currentValueString.length - 1)
    return currentValueString
}

const fixInputNumberValue = (value) => {
    if (!value || value === '') return ''
    const stringValue = value.toString()
    const fixedStringValue = stringValue.replace(regExp.ifNotNumbersCommaAndPoint, '').replace(',', '.')
    const pointsInFixedStringValue = fixedStringValue.match(/[.]/g)
    const existsTwoPoints = !pointsInFixedStringValue ? false : pointsInFixedStringValue.length > 1 ? true : false
    const pointsAreFollowed = !existsTwoPoints
        ? false
        : (fixedStringValue.indexOf('.') + 1 === fixedStringValue.lastIndexOf('.')) ? true : false
    const fixedValue = (existsTwoPoints && !pointsAreFollowed) ? fixedStringValue.substring(0, fixedStringValue.length - 1) : fixedStringValue
    return fixedValue
}

// Non case sensitive for 'Select' antd
const nonCaseSensitive = (inputValue, option) => {
    const normalizedInputValue = normalizeString(inputValue)
    const normalizedOptionValue = normalizeString(option.value)
    if (normalizedOptionValue.toUpperCase().indexOf(normalizedInputValue.toUpperCase()) !== -1) return true
    else return false
}

const replaceFor = (string, segment, newSegment) => {
    const newString = string.replaceAll(segment, newSegment)
    return newString
}

const stringHelper = {
    completeLengthWithZero,
    fixInputNumber,
    fixInputNumberValue,
    nonCaseSensitive,
    normalizeString,
    regExp,
    replaceFor
}

export default stringHelper