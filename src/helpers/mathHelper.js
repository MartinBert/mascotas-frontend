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

const round = (value) => {
    return Math.round(value)
}

const roundToMultiple = (value, multipleOf) => {
    const rest = value % multipleOf
    const roundingReference = multipleOf / 2
    const roundedValue = (rest >= roundingReference)
        ? value + multipleOf - rest
        : value - rest
    const roundedValueFixed = roundTwoDecimals(roundedValue)
    return roundedValueFixed
}

function roundTwoDecimals (num, decimals = 2) {
    var signo = (num >= 0 ? 1 : -1)
    num = num * signo
    if (decimals === 0) //with 0 decimals
        return signo * Math.round(num)
    // round(x * 10 ^ decimals)
    num = num.toString().split('e')
    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimals) : decimals)))
    // x * 10 ^ (-decimals)
    num = num.toString().split('e')
    return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimals) : -decimals))
}

const mathHelper = {
    decimalPercent,
    isPar,
    nextInteger,
    nextIntegerMultipleOf_10,
    previousInteger,
    randomFiveDecimals,
    round,
    roundToMultiple,
    roundTwoDecimals
}

export default mathHelper