import cn from 'classnames';
import React from 'react';
import classes from './Modal.module.scss';

type PropsType = {
	children: JSX.Element,
	isShow: boolean,
};

export const Modal: React.FC<PropsType> = ({children, isShow}) => {
	return (
		<div className={cn(classes.Modal, isShow ? classes._show : '') } >
			<div className={classes.body}>
				{children}
			</div>
		</div>
	)
}
