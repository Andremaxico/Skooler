import React, {useRef, useEffect} from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import { AccountInfo } from './AccountInfo';
import { getMenuItem } from '../../utils/helpers/getMenuItem';
import classes from './Header.module.scss';
import { schoolsAPI } from '../../api/schoolsApi';
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../Redux/account/account-selectors';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import logo from '../../assets/images/logo.png';
import { useAppDispatch } from '../../Redux/store';
import { headerHeightReceived } from '../../Redux/app/appReducer';
import { searchShowingStatusChanged } from '../../Redux/stream/stream-reducer';
import { selectIsSearchShowing } from '../../Redux/stream/stream-selectors';
import CloseIcon from '@mui/icons-material/Close';



type PropsType = {};

const AppHeader: React.FC<PropsType> = ({}) => {
	const loginData = useSelector(selectMyLoginData);
	const isSearching = useSelector(selectIsSearchShowing);

	const headerRef = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const headerHeight = headerRef.current?.clientHeight || 0;
		dispatch(headerHeightReceived(headerHeight));
	}, [])
   
	const handleSearchBtnClick = () => {
		dispatch(searchShowingStatusChanged(true));
	}
	const handleCloseBtnClick = () => {
		dispatch(searchShowingStatusChanged(false));
	}

	return (
		<header className={classes.AppHeader} ref={headerRef}>
			<div className={classes.buttons}>
				{!isSearching ?
					<button className={classes.btn} onClick={handleSearchBtnClick}>
						<FilterListIcon className={classes.icon} />
					</button>
					:
					<button className={classes.btn} onClick={handleCloseBtnClick}>
						<CloseIcon className={classes.icon} />
					</button>
				}
				<button className={classes.btn}>
					<SearchIcon className={classes.icon} />
				</button>
			</div>
			<NavLink to={'/'} className={classes.logo}>
				<img src={logo} alt='Skooler'/>
			</NavLink>
			{/* <AppMenu mode='horizontal' /> */}
			<div className={classes.accountLink}>
				{loginData && <AccountInfo loginData={loginData} />}
			</div>
		</header>
	)
}

export default AppHeader;
