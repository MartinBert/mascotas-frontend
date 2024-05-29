const completeLengthWithZero = (value, length) => {
    const cicles = length - value.toString().length
    if(cicles <= 0) return value
    for(let i = 0; i < cicles; i++){
        value = '0'+ value
    }
    return value
}

// --- Non case sensitive for 'Autocomplete' antd ---- //
const nonCaseSensitive = (inputValue, option) =>
    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

const regExp = {
    ifNotNumber: /\D/gm,
    ifNotNumbersOrBar: /[^0-9\/]/gm,
    ifSpecialCharacter: /\W/gm
}

const replaceFor = (string, segment, newSegment) => {
    const newString = string.replaceAll(segment, newSegment)
    return newString
}

const stringHelper = {
    completeLengthWithZero,
    nonCaseSensitive,
    regExp,
    replaceFor
}

export default stringHelper