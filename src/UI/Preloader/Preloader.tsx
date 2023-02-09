import React from 'react'
import preloader from '../../assets/images/book-loader.gif'
import classes from './Preloader.module.scss';

type PropsType = {
	width?: number,
	height?: number,
};


//hehehey it`s a testaasdfdfSADSSSDSDJDJK;KL;;;;;;;;HELLLO WORLD HOW ARE YOU? i``M FINE

const Paper = () => {
	return <li></li>
}

const Preloader: React.FC<PropsType> = ({width = 50, height = width}) => {
	const n = 18;

	return (
		<div className={classes.Preloader}>
			<div className={classes.clockLoader}></div>
		</div>
	)
}

export default Preloader