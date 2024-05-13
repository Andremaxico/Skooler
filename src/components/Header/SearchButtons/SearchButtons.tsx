import React, { useState } from 'react';
import classes from './SearchButtons.module.scss';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSelector } from 'react-redux';
import { searchShowingStatusChanged } from '../../../Redux/stream/stream-reducer';
import { selectIsSearchShowing } from '../../../Redux/stream/stream-selectors';
import { useAppDispatch } from '../../../Redux/store';
import { useLocation } from 'react-router-dom';
import cn from 'classnames';

type PropsType = {
	setIsSearchUserFormShow: (value: boolean) => void,
	isUsersSearching: boolean,
};

export const SearchButtons: React.FC<PropsType> = ({setIsSearchUserFormShow, isUsersSearching}) => {
	const isSearching = useSelector(selectIsSearchShowing);

	const location = useLocation();
	const isOnHome = location.pathname === '/';

	const dispatch = useAppDispatch();
	const handleSearchQuestionsBtnClick = () => {
		if(!isUsersSearching) {
			dispatch(searchShowingStatusChanged(true));
		}
	}
	const handleCloseBtnClick = () => {
		dispatch(searchShowingStatusChanged(false));
	}

	const handleSearchUsersBtnClick = () => {
		setIsSearchUserFormShow(true);
		console.log('handle click');
	}
	const handleCloseUsersBtnClick = () => {
		setIsSearchUserFormShow(false);
	}



	return (
		<div className={classes.SearchQuestions}>

			{isOnHome && !isSearching ?
				<button className={classes.btn} onClick={handleSearchQuestionsBtnClick}>
					<FilterListIcon className={classes.icon} />
				</button>
				: isOnHome &&
				<button className={classes.btn} onClick={handleCloseBtnClick}>
					<CloseIcon className={classes.icon} />
				</button>
			}
			{!isUsersSearching ?
				<button className={classes.btn} onClick={handleSearchUsersBtnClick}>
					<SearchIcon className={classes.icon} />
				</button>
			:
				<button className={cn(classes.btn, classes._closeUsersSearch)}  onClick={handleCloseUsersBtnClick}>
					<CloseIcon className={classes.icon} />
				</button>
			}
		</div>
	)
}
