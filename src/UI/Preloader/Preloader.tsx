import React from 'react'
import preloader from '../../assets/images/book-loader.gif'
import classes from './Preloader.module.scss';
import cn from 'classnames';

type PropsType = {
	width?: number,
	height?: number,
	fixed?: boolean,
};


//hehehey it`s a testaasdfdfSADSSSDSDJDJK;KL;;;;;;;;HELLLO WORLD HOW ARE YOU? i``M FINE

const Paper = () => {
	return <li></li>
}

const Preloader: React.FC<PropsType> = ({width = 50, height = width, fixed}) => {
	const n = 18;

	return (
		<div className={cn(classes.Preloader, fixed && classes._fixed)}>
			<div className={classes.clockLoader}></div>
		</div>
	)
}

export default Preloader