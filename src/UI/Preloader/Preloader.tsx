import React from 'react'
import classes from './Preloader.module.scss';
import preloader from '../../assets/images/preloader.gif'

type PropsType = {
	width?: number,
	height?: number,
};

const Preloader: React.FC<PropsType> = ({width, height = width}) => {
	return (
		<div className={classes.Preloader}>
			<img src={preloader} alt='Loading...' width={width || '100%'} height={height || '100%'}/>
		</div>
	)
}

export default Preloader