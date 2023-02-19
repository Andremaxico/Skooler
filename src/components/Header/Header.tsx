import React, {useRef, useEffect} from 'react'
import { NavLink } from 'react-router-dom';
import { AccountInfo } from './AccountInfo';
import classes from './Header.module.scss';
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../Redux/account/account-selectors';
import logo from '../../assets/images/logo.png';
import { useAppDispatch } from '../../Redux/store';
import { headerHeightReceived } from '../../Redux/app/appReducer';
import { SearchQuestions } from './SearchQuestions';




type PropsType = {};

const AppHeader: React.FC<PropsType> = ({}) => {
	const loginData = useSelector(selectMyLoginData);

	const headerRef = useRef<HTMLDivElement>(null);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const headerHeight = headerRef.current?.clientHeight || 0;
		dispatch(headerHeightReceived(headerHeight));
	}, [])

	return (
		<header className={classes.AppHeader} ref={headerRef}>
			<SearchQuestions />
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
