const completeLengthWithZero = (value, length) => {
    const cicles = length - value.toString().length
    if(cicles <= 0) return value
    for(let i = 0; i < cicles; i++){
        value = '0'+ value
    }
    return value
}

const replaceFor = (string, segment, newSegment) => {
    const newString = string.replaceAll(segment, newSegment)
    return newString
}

const stringHelper = {
    completeLengthWithZero,
    replaceFor
}

export default stringHelper