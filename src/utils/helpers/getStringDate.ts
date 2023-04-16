//11 травня 2022
export const getStringDate = (ms: number) => {
	const date = new Date(ms);

	const monthes = [
		'Січня', 'Лютого', 'Березня', 'Квітня', 
		'Травня', 'Червня', 'Липня', 'Серпня', 
		'Вересня', 'Жовтня', 'Листопада', 'Грудня', 
	];

	const day = date.getDate();
	const month = monthes[date.getMonth()];
	const year = date.getFullYear();

	const stringDate = `${day} ${month} ${year}`;

	return stringDate;
}