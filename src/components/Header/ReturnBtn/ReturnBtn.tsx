import React from 'react';
import classes from './ReturnBtn.module.scss';
import cn from 'classnames';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  
import { useSelector } from 'react-redux';
import { selectLastPrevPage, selectPrevPages } from '../../../Redux/app/appSelectors';
import { useLocation, useNavigate } from 'react-router-dom';

type PropsType = {
	className?: string,
	returnTo?: string,
};

export const ReturnBtn: React.FC<PropsType> = ({className, returnTo}) => {
	const prevPage = useSelector(selectLastPrevPage);

	console.log('prevPage', prevPage);

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const isAnotherPage = prevPage !== pathname;
 
	const returnBack = () => {
		if(returnTo) {
			navigate(returnTo);
		} else {
			navigate(isAnotherPage ? prevPage : '/', {replace: true});
		}
	}

	return (
		<button className={cn(classes.ReturnBtn, className)} onClick={returnBack}>
			<ArrowBackIcon className={classes.icon} />
		</button>
	)
}
