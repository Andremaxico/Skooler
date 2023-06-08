import React from 'react'
import preloader from '../../assets/images/book-loader.gif'
import classes from './Preloader.module.scss';
import cn from 'classnames';

type PropsType = {
	width?: number,
	height?: number,
	fixed?: boolean,
};



const Preloader: React.FC<PropsType> = ({width = 50, height = width, fixed}) => {
	return (
		<div className={cn(classes.Preloader, fixed && classes._fixed)} id='preloader'>
			<div className={classes.clockLoader}></div>
		</div>
	)
}

export default Preloader