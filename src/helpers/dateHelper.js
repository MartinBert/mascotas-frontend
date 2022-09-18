const twoCharsPattern = (value) => {
    return (value.length === 1) ? '0' + value : value;
}

const simpleDateWithHours = (unformattedDate) => {
    const date = new Date(unformattedDate);
    const year = date.getFullYear().toString();
    const month = (parseInt(date.getMonth()) + 1).toString();
    const day = date.getDate().toString();
    const hour = date.getHours().toString();
    const minutes = date.getMinutes().toString();
    const seconds = date.getSeconds().toString();
    return twoCharsPattern(day) + '/' + twoCharsPattern(month) + '/' + year + ' ' + twoCharsPattern(hour) + ':' + twoCharsPattern(minutes) + ':' + twoCharsPattern(seconds);
}

const dateToAfip = (unformattedDate) => {
    const date = new Date(unformattedDate);
    const year = date.getFullYear().toString();
    const month = (parseInt(date.getMonth()) + 1).toString();
    const day = date.getDate().toString();
    return year + twoCharsPattern(month) + twoCharsPattern(day);
}

const dateToQrAfip = (unformattedDate) => {
    const date = new Date(unformattedDate);
    const year = date.getFullYear().toString();
    const month = (parseInt(date.getMonth()) + 1).toString();
    const day = date.getDate().toString();
    return year + '-' + twoCharsPattern(month) + '-' + twoCharsPattern(day);
}

const dateHelper = {
    simpleDateWithHours,
    dateToAfip,
    dateToQrAfip
}

export default dateHelper;