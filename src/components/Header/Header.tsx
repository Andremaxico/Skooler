import * as React from 'react'
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

const { Header } = Layout;

type PropsType = {};

const AppHeader: React.FC<PropsType> = ({}) => {
	const loginData = useSelector(selectMyLoginData);

	return (
		<header className={classes.AppHeader}>
			<NavLink to={'/'} className={classes.logo}>
				<img src={logo} alt='Skooler'/>
			</NavLink>
			{/* <AppMenu mode='horizontal' /> */}
			<div className={classes.accountLink}>
				<AccountInfo loginData={loginData} />
			</div>
		</header>
	)
}

export default AppHeader;
