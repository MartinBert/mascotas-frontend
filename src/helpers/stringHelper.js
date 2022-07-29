const completeLengthWithZero = (value, length) => {
    const cicles = length - value.toString().length;
    if(cicles <= 0) return value;
    for(let i = 0; i < cicles; i++){
        value = '0'+ value;
    }
    return value;
}

const stringHelper = {
    completeLengthWithZero
}

export default stringHelper;