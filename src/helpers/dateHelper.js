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

const localFormat = (unformattedDate) => {
    const date = new Date(unformattedDate)
    const year = date.getFullYear().toString()
    const month = (parseInt(date.getMonth()) + 1)
    const day = date.getDate()

    const fixedDay = (day < 10) ? '0' + day.toString() : day.toString()
    const fixedMonth = (month < 10) ? '0' + month.toString() : month.toString()
    return fixedDay + '/' + fixedMonth + '/' + year
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

const addDays = (
    date,

    // value you want +0: not includes the last day
    // value you want +1: includes the last day
    daysQuantity

) => {
    const dateToModify = Date.parse(date) - Date.parse(date) % 86400000 // Date in milliseconds
    const dateModified = new Date(dateToModify + daysQuantity * 86400000 - 1)
    return dateModified
}

const isItLater = (initialDate, finalDate) => {
    const reference = addDays(initialDate, 1)
    const dateToCompare = addDays(finalDate, 0)
    const response = (dateToCompare >= reference) ? true : false
    return response
}

const dateHelper = {
    localFormat,
    simpleDateWithHours,
    dateToAfip,
    dateToQrAfip,
    addDays,
    isItLater
}

export default dateHelper