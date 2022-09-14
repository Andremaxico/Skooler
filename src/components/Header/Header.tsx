import * as React from 'react'
import { NavLink } from 'react-router-dom';
import { AccountInfo } from './AccountInfo';
import { Layout, Menu } from 'antd';
import { LinkDataType, SchoolSearchItemType, UserType } from '../../utils/types';
import { getMenuItem } from '../../utils/helpers/getMenuItem';
import classes from './Header.module.scss';
import { schoolsAPI } from '../../api/schoolsApi';

const { Header } = Layout;

type PropsType = {
	accountData: UserType | null,
};

const AppHeader: React.FC<PropsType> = ({accountData}) => {
	//test api
	React.useEffect(() => {
		console.log('account data', accountData);
	}, [accountData])
	

	const linksData: LinkDataType[] = [
		{
			path: '/chat', id: 1, text: 'Chat'
		},
		{
			path: '/account', id: 2, text: 'Account'
		},
	];

	const navItems = linksData.map(data => {
		return getMenuItem(
			<NavLink to={data.path} className={classes.link}>{data.text}</NavLink>,
			data.id
		)
	})

	return (
		<Header className={classes.AppHeader}>
			<div className={classes.logo}>Logo</div>
			<Menu
				theme='dark' mode='horizontal' defaultSelectedKeys={['1']}
				items={navItems} className={classes.menu}
			/>
			<AccountInfo accountData={accountData}/>
		</Header>
	)
}

export default AppHeader;
