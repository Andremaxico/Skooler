import React from 'react';
import classes from './NetworkError.module.scss';
import { Typography } from '@mui/joy';

type PropsType = {
	message: string,
};

export const NetworkError: React.FC<PropsType> = ({message}) => {
	console.log('network error render');
	return (
		<div className={classes.NetworkError}>
			<Typography className={classes.message}>{message}</Typography>
		</div>
	)
}
