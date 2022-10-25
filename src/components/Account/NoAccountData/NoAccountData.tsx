import React from 'react';
import { ErrorIcon } from '../../../UI/Icons';
import classes from './NoAccountData.module.scss';

export const NoAccountData = () => {
	return (
		<div className={classes.NoAccountData}>
			<ErrorIcon className={classes.icon} />
			<span className={classes.text}>Користувач ще не вніс свої дані</span>
		</div>
	)
}
