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
import { selectNetworkError } from '../../Redux/app/appSelectors';
import { NetworkError } from '../../UI/NetworkError';
import { AppMenu } from './AppMenu';

const { Header } = Layout;

type PropsType = {};

const AppHeader: React.FC<PropsType> = ({}) => {
	const networkError  = useSelector(selectNetworkError);
	const loginData = useSelector(selectMyLoginData);

	return (
		<Header className={classes.AppHeader}>
			<div className={classes.logo}>Logo</div>
			{/* <AppMenu mode='horizontal' /> */}
			<AccountInfo loginData={loginData}/>
			{networkError && 
				<NetworkError message={networkError}/>
			}
		</Header>
	)
}

export default AppHeader;
