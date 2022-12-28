// Does not allow empty keys - 'true' is successful validation
const noEmptyKeys = (obj) => {
    const validation = !Object.values(obj).some(value => (value === ''))
    return validation
}

const formHelpers = {
    noEmptyKeys
}

export default formHelpers