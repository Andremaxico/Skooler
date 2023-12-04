import React from 'react';
import classes from './OtherLoginMethods.module.scss';
import cn from 'classnames';
import { FacebookBtn } from '../../../UI/LoginMethodsBtns/FacebookBtn';
import { GoogleBtn } from '../../../UI/LoginMethodsBtns/GoogleBtn';

type PropsType = {
	className?: string,
}

export const OtherLoginMethods: React.FC<PropsType> = ({className}) => {
	return (
		<div className={cn(classes.OtherLoginMethods, className)}>
			<p className={classes.text}>
				Увійти за допомогою:
			</p>
			<div className={classes.buttons}>
				<GoogleBtn className={classes.btn}/>
				<FacebookBtn className={classes.btn} />
			</div>
		</div>
	)
}
