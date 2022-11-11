import React from 'react'
import classNamees from './Preloader.module.scss';
import preloader from '../../assets/images/preloader.gif'
import classes from './Preloader.module.scss';

type PropsType = {
	width?: number,
	height?: number,
};


//hehehey it`s a testaasdfdfSADSSSDSDJDJK;KL;;;;;;;;HELLLO WORLD HOW ARE YOU? i``M FINE

const Preloader: React.FC<PropsType> = ({width = 50, height = width}) => {
	return (
		<div className={classNamees.Preloader}>
			<div className={classes.pencil} style={{width: width, height: height}}>
				<div className={classes.pencil__ballPoint}></div>
				<div className={classes.pencil__cap}></div>
				<div className={classes.pencil__capBase}></div>
				<div className={classes.pencil__middle}></div>
				<div className={classes.pencil__eraser}></div>
			</div>
			<div className={classes.line}></div>
		</div>
	)
}

export default Preloader