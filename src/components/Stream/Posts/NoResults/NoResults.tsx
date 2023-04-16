import React from 'react';
import classes from './NoResults.module.scss';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type PropsType = {
	reloadStream: () => void,
}

export const NoResults: React.FC<PropsType> = ({reloadStream}) => {
	return (
		<div className={classes.noQuestions}>
			<button className={classes.btn} onClick={reloadStream}>
				<ArrowBackIcon className={classes.icon}/>
			</button>
			<p className={classes.text}>Нічого не знайдено</p>
		</div>
	)
}
