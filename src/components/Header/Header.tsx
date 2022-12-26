import React, {useRef, useEffect} from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import { AccountInfo } from './AccountInfo';
import { Layout, Menu } from 'antd';
import { LinkDataType, SchoolSearchItemType, UserType } from '../../utils/types';
import { getMenuItem } from '../../utils/helpers/getMenuItem';
import classes from './Header.module.scss';
import { schoolsAPI } from '../../api/schoolsApi';
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../Redux/account/account-selectors';

import logo from '../../assets/images/logo.png';
import { useAppDispatch } from '../../Redux/store';
import { headerHeightReceived } from '../../Redux/app/appReducer';

const { Header } = Layout;

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
