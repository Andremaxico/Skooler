import React, { useEffect } from 'react';
import classes from './Welcoming.module.scss';
import { useNavigate } from 'react-router-dom';


type PropsType = {
	isLoading: boolean,
};

export const Welcoming: React.FC<PropsType> = ({isLoading}) => {
	const navigate = useNavigate();

	useEffect(() => {
		console.log('is loading', isLoading);

		if(!isLoading) {
			const timeout = setTimeout(() => {
				navigate('/', {replace: true});
			}, 2000);
		}
	}, [isLoading]);

	return (
		<div className={classes.Welcoming}>
			<h1 className={classes.title}>
				Вітаємо у <span className={classes.skooler}>Skooler</span>!
			</h1>
			<p className={classes.text}>Приємного використання!</p>
		</div>
	)
}
