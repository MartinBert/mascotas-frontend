const roundTwoDecimals = (value) => {
    return Math.round(Number(value) * 100) / 100;
}

const decimalPercent = (value) => {
    return Number(value) / 100;
}

const mathHelper = {
    roundTwoDecimals,
    decimalPercent
}

export default mathHelper;