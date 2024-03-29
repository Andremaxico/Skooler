import { FieldValue } from 'firebase/firestore';
import React from 'react';
import classes from './PostDate.module.scss';
import cn from 'classnames';
import { getStringDate } from '../../utils/helpers/date/getStringDate';

type PropsType = {
	createdAt: FieldValue,
	closed?: boolean,
	answer?: boolean,
}	

export const PostDate: React.FC<PropsType> = ({createdAt, closed, answer}) => {
	//@ts-ignore //timestamp - givno(shit)
	const msDate = createdAt ? createdAt.seconds * 1000 : null;

	const stringDate = msDate ? getStringDate(msDate) : '';

	return (
		<div className={cn(
			classes.PostDate, 
			closed ? classes._closed : '',
			answer ? classes._answer : ''
		)}>
			<p className={classes.text}>{stringDate}</p>
		</div>
	)
}
