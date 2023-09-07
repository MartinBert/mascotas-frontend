const round = (value) => {
    return Math.round(value)
}

const roundTwoDecimals = (value) => {
    return Math.round(Number(value) * 100) / 100
}

const decimalPercent = (value) => {
    return Number(value) / 100;
}

const roundToMultiple = (value, multipleOf) => {
    const rest = value % multipleOf
    const roundingReference = multipleOf / 2
    const roundedValue = (rest >= roundingReference)
        ? value + multipleOf - rest
        : value - rest
    return roundedValue
}

const previousInteger = (value) => {
    return Math.floor(value)
}

const randomFiveDecimals = () => {
    return Math.floor(Math.random()*90000) + 10000
}

const nextIntegerMultipleOf_10 = (value) => {
    const roundedNumber = value - value % 10 + 10
    return roundedNumber
}

const mathHelper = {
    round,
    roundToMultiple,
    roundTwoDecimals,
    decimalPercent,
    previousInteger,
    randomFiveDecimals,
    nextIntegerMultipleOf_10
}

export default mathHelper