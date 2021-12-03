const roundTwoDecimals = (value) => {
    return Math.round(Number(value) * 100) / 100;
}

const decimalPercent = (value) => {
    return Number(value) / 100;
}

const randomFiveDecimals = () => {
    return Math.floor(Math.random()*90000) + 10000;
}

const mathHelper = {
    roundTwoDecimals,
    decimalPercent,
    randomFiveDecimals
}

export default mathHelper;