import React from 'react';
import classes from './AccountInfo.module.scss';
import { ReceivedAccountDataType } from '../../../../utils/types';
import { getStringDate } from '../../../../utils/helpers/getStringDate';
import { Link } from 'react-router-dom';
import cn from 'classnames';

type PropsType = {
	accountData: ReceivedAccountDataType,
	className?: string, 
}

export const AccountInfo: React.FC<PropsType> = ({accountData, className}) => {
	const { class: classNum, birthDate, rating, school} = accountData;

	let birthDayDate: string | null = null;

	console.log('birthDate', birthDate);

	if(!!birthDate) {
		const date = new Date();
		birthDayDate = getStringDate(date.getTime());
	}

	return (
		<ul className={cn(classes.AccountInfo, className)}>
			<h3 className={classes.title}>Деталі</h3>
			<li className={classes.classNum}>
				<p>{classNum} клас</p>
			</li>
			{birthDate &&
				<li className={classes.birthDate}>
					<span>{birthDayDate}</span> 
				</li>
			}
			<li className={classes.rating}>
				<p>{rating}</p>
			</li>
			<li className={classes.AccountSchool}>
				<Link to={school.website} title='Сайт школи' target='_blank' className={classes.school} >
					{school.institution_name}
				</Link>
			</li>
		</ul>
	)
}
