import React from 'react';
import { EmptyIcon } from '../../../UI/Icons/Icons';
import classes from './NoAnswers.module.scss';

type PropsType = {};

export const NoAnswers: React.FC<PropsType> = ({}) => {
	return (
		<div className={classes.NoAnswers}>
			<div className={classes.iconWrap}>
				<EmptyIcon className={classes.icon}/>
			</div>
			<p className={classes.text}>Відповідей поки що немає</p>
		</div>
	)
}
