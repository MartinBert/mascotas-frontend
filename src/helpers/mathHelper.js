import { errorAlert } from "../components/alerts"

const decimalPercent = (value) => {
    return Number(value) / 100
}

const isPar = (value) => {
    const verify = (value % 2) === 0
    return verify
}

const nextInteger = (value) => {
    return Math.ceil(value)
}

const nextIntegerMultipleOf_10 = (value) => {
    const roundedNumber = value - value % 10 + 10
    return roundedNumber
}

const previousInteger = (value) => {
    return Math.floor(value)
}

const randomFiveDecimals = () => {
    return Math.floor(Math.random() * 90000) + 10000
}

function round (valueToRound, decimals = 2) {
    let numberValue = parseFloat(valueToRound)
    if (isNaN(numberValue)) {
        return valueToRound
        // errorAlert('Error al redondear valor numérico. Contacte a su proveedor de sistema.')
        // throw Error(`Function 'round': Value can't be converted to numeric.`)
    }
    let signo = (numberValue >= 0 ? 1 : -1)
    numberValue = numberValue * signo
    if (decimals === 0) //with 0 decimals
        return signo * Math.round(numberValue)
    // round(x * 10 ^ decimals)
    numberValue = numberValue.toString().split('e')
    numberValue = Math.round(+(numberValue[0] + 'e' + (numberValue[1] ? (+numberValue[1] + decimals) : decimals)))
    // x * 10 ^ (-decimals)
    numberValue = numberValue.toString().split('e')
    const roundedValue = signo * (numberValue[0] + 'e' + (numberValue[1] ? (+numberValue[1] - decimals) : -decimals))
    return roundedValue
}

const roundToMultiple = (value, multipleOf) => {
    const rest = value % multipleOf
    const roundingReference = multipleOf / 2
    const roundedValue = (rest >= roundingReference)
        ? value + multipleOf - rest
        : value - rest
    const roundedValueFixed = round(roundedValue)
    return roundedValueFixed
}

const mathHelper = {
    decimalPercent,
    isPar,
    nextInteger,
    nextIntegerMultipleOf_10,
    previousInteger,
    randomFiveDecimals,
    round,
    roundToMultiple
}

export default mathHelper