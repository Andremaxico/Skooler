import React from 'react';
import classes from './SearchQuestions.module.scss';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSelector } from 'react-redux';
import { searchShowingStatusChanged } from '../../../Redux/stream/stream-reducer';
import { selectIsSearchShowing } from '../../../Redux/stream/stream-selectors';
import { useAppDispatch } from '../../../Redux/store';
import { useLocation } from 'react-router-dom';

type PropsType = {};

export const SearchQuestions: React.FC<PropsType> = ({}) => {
	const isSearching = useSelector(selectIsSearchShowing);


	const location = useLocation();
	const isOnHome = location.pathname === '/';

	const dispatch = useAppDispatch();
	const handleSearchBtnClick = () => {
		dispatch(searchShowingStatusChanged(true));
	}
	const handleCloseBtnClick = () => {
		dispatch(searchShowingStatusChanged(false));
	}

	return (
		<div className={classes.SearchQuestions}>

			{isOnHome && !isSearching ?
				<button className={classes.btn} onClick={handleSearchBtnClick}>
					<FilterListIcon className={classes.icon} />
				</button>
				: isOnHome &&
				<button className={classes.btn} onClick={handleCloseBtnClick}>
					<CloseIcon className={classes.icon} />
				</button>
			}
			<button className={classes.btn}>
				<SearchIcon className={classes.icon} />
			</button>
		</div>
	)
}
