import { getStringDate } from "./getStringDate";

export const getMessageGroupDate = (ms: number) => {
    const date = new Date(ms);
    const nowDate = new Date();
    const yesterday = new Date(nowDate.getTime() - 1000 * 60 * 60 * 24);

    const timeDiff = nowDate.getTime() - date.getTime(); //miliseconds
    const timeToYesterday = nowDate.getHours() * 60 + nowDate.getMinutes(); //minutes
    const oneDayTime = 1000 * 60 * 60 * 24;
    const isToday = (timeDiff / 1000 / 60) < timeToYesterday;
    const isYesterday = !isToday && timeDiff < oneDayTime;
    const isOnWeek = !isToday && !isYesterday && timeDiff < timeToYesterday + 5 * oneDayTime;

    if(isToday) {
        return 'Сьогодні'
    } else if(isYesterday) {
        return 'Вчора';
    } else if(isOnWeek) {
        const daysOfTheWeek = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя'];
        const numOfDay = date.getDay();
        return daysOfTheWeek[numOfDay];
    } else {
        return getStringDate(ms);
    }
}