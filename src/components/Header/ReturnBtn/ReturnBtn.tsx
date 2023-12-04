import React from 'react';
import classes from './ReturnBtn.module.scss';
import cn from 'classnames';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  
import { useSelector } from 'react-redux';
import { selectPrevPage } from '../../../Redux/app/appSelectors';
import { useNavigate } from 'react-router-dom';

type PropsType = {
	className?: string,
};

export const ReturnBtn: React.FC<PropsType> = ({className}) => {
	const prevPage = useSelector(selectPrevPage);

	const navigate = useNavigate();

	const returnBack = () => {
		navigate(prevPage || '/', {replace: true});
	}

	return (
		<button className={cn(classes.ReturnBtn, className)} onClick={returnBack}>
			<ArrowBackIcon className={classes.icon} />
		</button>
	)
}
