import { FieldValue } from 'firebase/firestore';
import React from 'react';
import classes from './PostDate.module.scss';
import cn from 'classnames';

type PropsType = {
	createdAt: FieldValue,
	closed?: boolean,
}	

export const PostDate: React.FC<PropsType> = ({createdAt, closed}) => {
	//@ts-ignore //timestamp givno
	const msDate = createdAt ? createdAt.seconds * 1000 : null;

	const monthes = [
		'Січня', 'Лютого', 'Березня', 'Квітня', 
		'Травня', 'Червня', 'Липня', 'Серпня', 
		'Вересня', 'Жовтня', 'Листопада', 'Грудня', 
	];

	const publishDate = msDate ? new Date(msDate) : new Date();
	const stringDate = `${publishDate.getDate()} ${monthes[publishDate.getMonth()].toLowerCase()} ${publishDate.getFullYear()}`;

	return (
		<div className={cn(classes.PostDate, closed ? classes._closed : '')}>
			<p className={classes.text}>{stringDate}</p>
		</div>
	)
}
