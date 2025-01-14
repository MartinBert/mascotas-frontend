// -------------------------------------- Base functions -------------------------------------- //
// Reset date to 00:00 hs
const resetDate = (date) => {
    const resetedDate = new Date(Date.parse(date) - Date.parse(date) % 86400000 + 10800000)
    return resetedDate
}

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

const afipDateToLocalFormat = (stringAfipDate) => {
    if (!stringAfipDate) return 'no-data'
    const includesHyphen = stringAfipDate.includes('-')
    const parsedStringDate = includesHyphen ? stringAfipDate.slice(0, 10) : stringAfipDate.slice(0, 8)
    const year = parsedStringDate.slice(0, 4)
    const month = includesHyphen ? parsedStringDate.slice(5, 7) : parsedStringDate.slice(4, 6)
    const day = includesHyphen ? parsedStringDate.slice(8, 10) : parsedStringDate.slice(6, 8)
    const localformat = day + '/' + month + '/' + year
    return localformat
}

const dateToAfip = (unformattedDate) => {
    const date = new Date(unformattedDate)
    const year = date.getFullYear().toString()
    const month = (parseInt(date.getMonth()) + 1).toString()
    const day = date.getDate().toString()
    const dateToReturn = year + twoCharsPattern(month) + twoCharsPattern(day)
    return dateToReturn
}

const dateToQrAfip = (unformattedDate) => {
    const date = new Date(unformattedDate)
    const year = date.getFullYear().toString()
    const month = (parseInt(date.getMonth()) + 1).toString()
    const day = date.getDate().toString()
    return year + '-' + twoCharsPattern(month) + '-' + twoCharsPattern(day)
}

const getLastFortnight = () => {
    const resetTodayDateInMs = Date.parse(resetDate(new Date()))
    const today = resetTodayDateInMs + 85399999
    const initDateOfLastFortnight = resetTodayDateInMs - 14 * 86400000
    const lastFortnight = [new Date(initDateOfLastFortnight), new Date(today)]
    return lastFortnight
}

const getLastMonth = () => {
    const resetTodayDateInMs = Date.parse(resetDate(new Date()))
    const today = resetTodayDateInMs + 85399999
    const initDateOfLastMonth = resetTodayDateInMs - 30 * 86400000
    const lastMonth = [new Date(initDateOfLastMonth), new Date(today)]
    return lastMonth
}

const getLastWeek = () => {
    const resetTodayDateInMs = Date.parse(resetDate(new Date()))
    const today = resetTodayDateInMs + 85399999
    const initDateOfLastWeek = resetTodayDateInMs - 7 * 86400000
    const lastWeek = [new Date(initDateOfLastWeek), new Date(today)]
    return lastWeek
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

const localFormatToDateObj = (localFormatDate) => {
    // localFormatDate is 'yyyy/mm/dd'
    const day = parseFloat(localFormatDate.slice(0, 2))
    const month = parseFloat(localFormatDate.slice(3, 5)) - 1
    const year = parseFloat(localFormatDate.slice(6, 10))
    const dateObj = new Date(year, month, day)
    return dateObj
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
    afipDateToLocalFormat,
    dateToAfip,
    dateToQrAfip,
    getLastFortnight,
    getLastMonth,
    getLastWeek,
    getTomorrowDate,
    getYesterdayDate,
    isItLater,
    localFormat,
    localFormatToDateObj,
    resetDate,
    simpleDateWithHours
}

export default dateHelper