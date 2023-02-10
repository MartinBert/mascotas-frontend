const twoCharsPattern = (value) => {
    return (value.length === 1) ? '0' + value : value
}

const simpleDateWithHours = (unformattedDate) => {
    const date = new Date(unformattedDate)
    const year = date.getFullYear().toString()
    const month = (parseInt(date.getMonth()) + 1).toString()
    const day = date.getDate().toString()
    const hour = date.getHours().toString()
    const minutes = date.getMinutes().toString()
    const seconds = date.getSeconds().toString()
    return twoCharsPattern(day) + '/' + twoCharsPattern(month) + '/' + year + ' ' + twoCharsPattern(hour) + ':' + twoCharsPattern(minutes) + ':' + twoCharsPattern(seconds)
}

const dateToAfip = (unformattedDate) => {
    const date = new Date(unformattedDate)
    const year = date.getFullYear().toString()
    const month = (parseInt(date.getMonth()) + 1).toString()
    const day = date.getDate().toString()
    return year + twoCharsPattern(month) + twoCharsPattern(day)
}

const dateToQrAfip = (unformattedDate) => {
    const date = new Date(unformattedDate)
    const year = date.getFullYear().toString()
    const month = (parseInt(date.getMonth()) + 1).toString()
    const day = date.getDate().toString()
    return year + '-' + twoCharsPattern(month) + '-' + twoCharsPattern(day)
}

const addDays = (date, daysQuantity) => {
    const dateToModify = Date.parse(date) - Date.parse(date) % 86400000 // Date in milliseconds
    const dateModified = new Date(dateToModify + daysQuantity * 86400000 - 1)
    return dateModified
}

const dateHelper = {
    simpleDateWithHours,
    dateToAfip,
    dateToQrAfip,
    addDays
}

export default dateHelper