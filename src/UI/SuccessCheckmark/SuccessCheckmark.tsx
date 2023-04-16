import React, { useEffect, useState } from 'react';
import classes from './SuccessCheckmark.module.scss';

type PropsType = {
	timeout?: number,
};

export const SuccessCheckmark: React.FC<PropsType> = ({timeout = 0}) => {
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

	useEffect(() => {
		setTimeout(() => {
			setIsSuccess(true);
		}, timeout);
	}, [])

	return (
		<div className={classes.SuccessСheckmark} >
			 {isSuccess && <div className={classes.checkIcon}>
				<span className={`${classes.iconLine} ${classes.lineTip}`}></span>
				<span className={`${classes.iconLine} ${classes.lineLong}`}></span>
				<div className={classes.iconCircle}></div>
				<div className={classes.iconFix}></div>
			</div>}
		</div>
	)
}
