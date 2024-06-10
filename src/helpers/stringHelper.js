const countDecimalPlaces = (stringValue) => {
    const pointPosition = stringValue.indexOf('.')
    if (pointPosition === -1) return 0
    const lastDecimalPosition = stringValue.length - 1
    const numberOfDecimalPlaces = lastDecimalPosition - pointPosition
    return numberOfDecimalPlaces
}

const regExp = {
    ifNotNumber: /\D/gm,
    ifNotNumbersOrBar: /[^0-9\/]/gm,
    ifNotNumbersCommaAndPoint: /[^0-9,.]/gm,
    ifSpecialCharacter: /\W/gm
}

const completeLengthWithZero = (value, length) => {
    const cicles = length - value.toString().length
    if (cicles <= 0) return value
    for (let i = 0; i < cicles; i++) {
        value = '0' + value
    }
    return value
}

// Fixed commas and points of input number values
const fixInputNumber = (currentValue, prevValue) => {
    // Data
    let currentValueString = currentValue.toString()
    const prevValueString = prevValue.toString()
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

// Non case sensitive for 'Autocomplete' antd
const nonCaseSensitive = (inputValue, option) =>
    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

const replaceFor = (string, segment, newSegment) => {
    const newString = string.replaceAll(segment, newSegment)
    return newString
}

const stringHelper = {
    completeLengthWithZero,
    fixInputNumber,
    nonCaseSensitive,
    regExp,
    replaceFor
}

export default stringHelper