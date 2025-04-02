// -------------------------------------- Base functions -------------------------------------- //
const msIn2359hs = 86399999
const msIn24hs = 86400000
const msIn3hs = 10800000

const convertDateIntoMs = (date) => {
    const dateObj = new Date(date)
    const parsedDate = Date.parse(dateObj)
    return parsedDate
}

const getDateInMsAt00hs = (date) => {
    const dateInMs = convertDateIntoMs(date)
    const dateInMsAt00hs = dateInMs - (dateInMs % msIn24hs) + msIn3hs
    return dateInMsAt00hs
}

const getDateInMsAt2359hs = (date) => {
    const dateInMs = convertDateIntoMs(date)
    const dateInMsAt00hs = dateInMs - (dateInMs % msIn24hs) + msIn3hs + msIn2359hs
    return dateInMsAt00hs
}

const resetDateTo00hs = (date) => {
    const dateInMsAt00hs = getDateInMsAt00hs(date)
    const resetedDate = new Date(dateInMsAt00hs)
    return resetedDate
}

const resetDateTo2359hs = (date) => {
    const dateInMsAt2359hs = getDateInMsAt2359hs(date)
    const resetedDate = new Date(dateInMsAt2359hs)
    return resetedDate
}

const twoCharsPattern = (chars) => {
    const charsLengthIs1 = chars.length === 1
    const updatedChars = charsLengthIs1 ? '0' + chars : chars
    return updatedChars
}

// --------------------------------------- Date Helper ---------------------------------------- //
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
    const resetTodayDateInMs = Date.parse(resetDateTo00hs(new Date()))
    const todayAt2359hs = resetTodayDateInMs + msIn24hs - 1
    const initDateOfLastFortnight = resetTodayDateInMs - 14 * msIn24hs
    const lastFortnight = [new Date(initDateOfLastFortnight), new Date(todayAt2359hs)]
    return lastFortnight
}

const getLastMonth = () => {
    const resetTodayDateInMs = Date.parse(resetDateTo00hs(new Date()))
    const todayAt2359hs = resetTodayDateInMs + msIn24hs - 1
    const initDateOfLastMonth = resetTodayDateInMs - 30 * msIn24hs
    const lastMonth = [new Date(initDateOfLastMonth), new Date(todayAt2359hs)]
    return lastMonth
}

const getLastWeek = () => {
    const resetTodayDateInMs = Date.parse(resetDateTo00hs(new Date()))
    const todayAt2359hs = resetTodayDateInMs + msIn24hs - 1
    const initDateOfLastWeek = resetTodayDateInMs - 7 * msIn24hs
    const lastWeek = [new Date(initDateOfLastWeek), new Date(todayAt2359hs)]
    return lastWeek
}

const getTomorrowDateAt00hs = () => {
    const todayDateInMsAt00hs = getDateInMsAt00hs(new Date())
    const tomorrowDateInMsAt00hs = todayDateInMsAt00hs + msIn24hs
    const tomorrowDateAt00hs = new Date(tomorrowDateInMsAt00hs)
    return tomorrowDateAt00hs
}

const getYesterdayDateAt00hs = () => {
    const todayDateInMsAt00hs = getDateInMsAt00hs(new Date())
    const yesterdayDateInMsAt00hs = todayDateInMsAt00hs - msIn24hs
    const yesterdayDateAt00hs = new Date(yesterdayDateInMsAt00hs)
    return yesterdayDateAt00hs
}

const isItLater = (initialDate, finalDate) => {
    const referenceDateInMs = getDateInMsAt00hs(resetDateTo00hs(initialDate))
    const dateToCompareInMs = getDateInMsAt00hs(finalDate)
    const isLaterThanReference = referenceDateInMs + msIn24hs <= dateToCompareInMs
    const response = isLaterThanReference ? true : false
    return response
}

const localFormat = (unformattedDate) => {
    const date = new Date(unformattedDate)
    const day = twoCharsPattern(date.getDate().toString())
    const month = twoCharsPattern((parseInt(date.getMonth()) + 1).toString())
    const year = date.getFullYear().toString()
    const parsedDate = day + '/' + month + '/' + year
    return parsedDate
}

const localFormatToDateObj = (localFormatDate) => {
    // localFormatDate is 'yyyy/mm/dd'
    const day = parseFloat(localFormatDate.slice(0, 2))
    const month = parseFloat(localFormatDate.slice(3, 5)) - 1
    const year = parseFloat(localFormatDate.slice(6, 10))
    const dateObj = new Date(year, month, day)
    return dateObj
}

const numberOrderDate = (stringDateInLocalFormat) => { // local format: dd/mm/yyyy
    const day = stringDateInLocalFormat.slice(0, 2)
    const month = stringDateInLocalFormat.slice(3, 5)
    const year = stringDateInLocalFormat.slice(6, 10)
    const stringOrderDate = year + month + day
    const numberOrderDate = parseFloat(stringOrderDate)
    return numberOrderDate // yyyymmdd
}

const resetDateTo00hsAndAddDays = (date, daysQuantity = 0) => {
    const dateInMsAt00hs = getDateInMsAt00hs(date)
    const calculatedDateInMsAt00hs = dateInMsAt00hs + daysQuantity * 86400000
    const calculatedDate = new Date(calculatedDateInMsAt00hs)
    return calculatedDate
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
    resetDateTo00hsAndAddDays,
    afipDateToLocalFormat,
    dateToAfip,
    dateToQrAfip,
    getLastFortnight,
    getLastMonth,
    getLastWeek,
    getTomorrowDateAt00hs,
    getYesterdayDateAt00hs,
    isItLater,
    localFormat,
    localFormatToDateObj,
    numberOrderDate,
    resetDateTo00hs,
    resetDateTo2359hs,
    simpleDateWithHours
}

export default dateHelper