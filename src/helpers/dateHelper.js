// -------------------------------------- Base functions -------------------------------------- //
const twoCharsPattern = (value) => {
    return (value.length === 1) ? '0' + value : value
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

const getTomorrowDate = () => {
    const tomorrow_ms =
        Date.parse(new Date()) // cantidad de ms en el instante actual
        + (86400000 - Date.parse(new Date()) % 86400000) // cantidad de ms hasta hoy a las 21 hs
        + 97199999 // ms que se suman para obtener mañana a las 23:59 hs
    const tomorrow = new Date(tomorrow_ms)
    return tomorrow
}

const getYesterdayDate = () => {
    const yesterday_ms =
        Date.parse(new Date()) // cantidad de ms en el instante actual
        + (86400000 - Date.parse(new Date()) % 86400000) // cantidad de ms hasta hoy a las 21 hs
        - 75600001 // ms que se restan para obtener ayer a las 23:59 hs
    const yesterday = new Date(yesterday_ms)
    return yesterday
}

const isItLater = (initialDate, finalDate) => {
    const reference = addDays(initialDate, 1)
    const dateToCompare = addDays(finalDate, 0)
    const response = (dateToCompare >= reference) ? true : false
    return response
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

// Reset date to 00:00 hs
const resetDate = (date) => {
    const resetedDate = new Date(Date.parse(date) - Date.parse(date) % 86400000 + 10800000)
    return resetedDate
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


const dateHelper = {
    addDays,
    dateToAfip,
    dateToQrAfip,
    getTomorrowDate,
    getYesterdayDate,
    isItLater,
    localFormat,
    resetDate,
    simpleDateWithHours
}

export default dateHelper