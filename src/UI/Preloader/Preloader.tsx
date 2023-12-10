import React from 'react'
import preloader from '../../assets/images/book-loader.gif'
import classes from './Preloader.module.scss';
import cn from 'classnames';

type PropsType = {
	width?: number,
	height?: number,
	fixed?: boolean,
	absolute?: boolean,
};



const Preloader: React.FC<PropsType> = ({width = 50, height = width, fixed, absolute}) => {
	return (
		<div 
			className={cn(
				classes.Preloader, 
				fixed && classes._fixed,
				absolute && classes._absolute
			)} 
			id='preloader'
		>
			<div className={classes.clockLoader}></div>
		</div>
	)
}

export default Preloader