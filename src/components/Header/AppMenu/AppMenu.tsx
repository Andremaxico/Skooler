import { MenuMode } from 'antd/lib/menu';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { LinkDataType } from '../../../utils/types';

type PropsType = {
	mode?: MenuMode,
};

export const AppMenu: React.FC<PropsType> = ({mode}) => {
	const location = useLocation();

	const linksData: LinkDataType[] = [
		{
			path: '/chat', id: 1, text: 'Чат'
		},
		{
			path: '/account', id: 2, text: 'Мій профіль'
		},
		{
			path: '/myschool', id: 3, text: 'Моя школа'
		}
	];

	// const navIcons: {[key in Partial<PathsType>]: React.ReactNode} = {
	// 	'/chat': <MessageOutlined />,
	// 	'/account': <UserOutlined />,
	// 	'/login': <div></div>,
	// 	'/myschool': <StudyIcon />,
	// 	'/': <div></div>,
	// 	'/new-post': <div></div>
	// }

	// const navItems = linksData.map(data => {
	// 	return getMenuItem(
	// 		<NavLink to={data.path} className={classes.link}>{data.text}</NavLink>,
	// 		data.path,
	// 		navIcons[data.path],
	// 	)
	// })

	return (
		// <Menu
		// 	className={classes.AppMenu}
		// 	theme='dark' mode={mode as any} defaultSelectedKeys={[location.pathname]}
		// 	items={navItems} selectedKeys={[location.pathname]}
		// />
		<div>no working</div>
	)
}
