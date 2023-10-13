// If the parameter is included in this array, it returns converted into a number
const convertToNumberTargets = [
    'discountPercentage',
    'surchargePercentage'
]

const formatValue = (target, value) => {
    const formattedValue = convertToNumberTargets.includes(target)
        ? parseFloat(value)
        : value
    return formattedValue
}

// Does not allow empty keys - 'true' is successful validation
const noEmptyKeys = (obj) => {
    const validation = !Object.values(obj).some(value => (value === ''))
    return validation
}

const formHelper = {
    formatValue,
    noEmptyKeys
}

export default formHelper