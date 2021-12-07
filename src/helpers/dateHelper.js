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
    return day + '/' + month.toString() + '/' + year + ' ' + hour + ':' + minutes + ':' + seconds;
}

const dateHelper = {
    simpleDateWithHours
}

export default dateHelper;