import React, {useRef, useEffect} from 'react'
import { NavLink } from 'react-router-dom';
import { AccountInfo } from './AccountInfo';
import classes from './Header.module.scss';
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../Redux/account/account-selectors';
import logo from '../../assets/images/logo.png';
import { useAppDispatch } from '../../Redux/store';
import { headerHeightReceived, returnBtnShowStatusChanged } from '../../Redux/app/appReducer';
import { SearchQuestions } from './SearchQuestions';
import { ReturnBtn } from './ReturnBtn';
import { selectPrevPage, selectReturnBtnShowStatus } from '../../Redux/app/appSelectors';




type PropsType = {};

const AppHeader: React.FC<PropsType> = ({}) => {
	const loginData = useSelector(selectMyLoginData);
	const isReturnBtnShow = useSelector(selectReturnBtnShowStatus);
	const prevPage = useSelector(selectPrevPage);

	const headerRef = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();

	useEffect(() => {
		const headerHeight = headerRef.current?.clientHeight || 0;
		dispatch(headerHeightReceived(headerHeight));
	}, [headerRef]);

	useEffect(() => {
		if(prevPage) {
			dispatch(returnBtnShowStatusChanged(true));
		}
	}, [prevPage])

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
				{loginData && <AccountInfo loginData={loginData} />}
			</div>
		</header>
	)
}

export default AppHeader;
