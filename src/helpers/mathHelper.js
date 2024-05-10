const decimalPercent = (value) => {
    return Number(value) / 100
}

const isPar = (value) => {
    const verify = (value % 2) == 0
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
    return Math.floor(Math.random()*90000) + 10000
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

const roundTwoDecimals = (value) => {
    return Math.round(Number(value) * 100) / 100
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