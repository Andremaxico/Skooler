import React, {useRef, useEffect} from 'react'
import { NavLink, unstable_useBlocker as useBlocker, useLocation } from 'react-router-dom';
import { AccountInfo } from './AccountInfo';
import classes from './Header.module.scss';
import { useSelector } from 'react-redux';
import { selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import logo from '../../assets/images/logo.png';
import { useAppDispatch } from '../../Redux/store';
import { headerHeightReceived, returnBtnShowStatusChanged } from '../../Redux/app/appReducer';
import { SearchQuestions } from './SearchQuestions';
import { ReturnBtn } from './ReturnBtn';
import { selectPrevPage, selectReturnBtnShowStatus } from '../../Redux/app/appSelectors';
import LoginIcon from '@mui/icons-material/Login';
import { IconButton } from '@mui/joy';



type PropsType = {};

const AppHeader: React.FC<PropsType> = ({}) => {
	const loginData = useSelector(selectMyLoginData);
	const myAccountData = useSelector(selectMyAccountData);
	const isReturnBtnShow = useSelector(selectReturnBtnShowStatus);
	const prevPage = useSelector(selectPrevPage);

	const headerRef = useRef<HTMLDivElement>(null);

	const	{ pathname } = useLocation();

	console.log('pathname', pathname);

	const dispatch = useAppDispatch();

	useEffect(() => {
		const headerHeight = headerRef.current?.clientHeight || 0;
		dispatch(headerHeightReceived(headerHeight));
	}, [headerRef]);

	useEffect(() => {
		console.log('prev page', prevPage === pathname);
		if(prevPage === pathname)  {
			dispatch(returnBtnShowStatusChanged(false));
		} else {
			dispatch(returnBtnShowStatusChanged(true));
		}
	}, [prevPage, pathname])

	return (
		<header className={classes.AppHeader} ref={headerRef}>
			<div className={classes.buttons}>
				{isReturnBtnShow && <ReturnBtn />}
				<SearchQuestions />
			</div>
			<NavLink to={'/'} className={classes.logo}>
				<img src={logo} alt='Skooler'/>
			</NavLink>
			{/* <AppMenu mode='horizontal' /> */}
			<div className={classes.accountLink}>
				{myAccountData ? 
					<AccountInfo loginData={loginData} />
				:
					<NavLink to='/login' className={classes.loginLink}>
						<LoginIcon className={classes.icon} />
					</NavLink>
				}
			</div>
		</header>
	)
}

export default AppHeader;
