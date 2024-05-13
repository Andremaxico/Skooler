export const getAgeFromDate = (date: Date) => {
    const nowTime = new Date().getTime();
    const dateTime = date.getTime();

    const years = Math.ceil((nowTime - dateTime) / 12 / 30 / 24 / 60 / 60 / 1000);

    if(isNaN(years)) {
        return '...'
    }

    return years;
}