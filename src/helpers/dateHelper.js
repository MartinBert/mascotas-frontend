const simpleDateWithHours = (unformattedDate) => {
    if(typeof(unformattedDate) === 'string'){
        unformattedDate = new Date(unformattedDate);
    }
    const year = unformattedDate.getFullYear();
    const month = parseInt(unformattedDate.getMonth()) + 1;
    const day = unformattedDate.getDate();
    const hour = unformattedDate.getHours();
    const minutes = unformattedDate.getMinutes();
    const seconds = unformattedDate.getSeconds();
    return day + '/' + ((month.toString().length === 1) ? '0' + month.toString() : month.toString()) + '/' + year + ' ' + hour + ':' + minutes + ':' + seconds;
}

const dateToAfip = (unformattedDate) => {
    const year = unformattedDate.getFullYear();
    const month = parseInt(unformattedDate.getMonth()) + 1;
    const day = unformattedDate.getDate();
    return year+((month.toString().length === 1) ? '0' + month.toString() : month.toString())+((day.toString().length === 1) ? '0' + day.toString() : day.toString());
}

const dateHelper = {
    simpleDateWithHours,
    dateToAfip
}

export default dateHelper;