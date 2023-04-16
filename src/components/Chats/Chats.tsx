import React from 'react';
import classes from './Chats.module.scss';
import cn from 'classnames';
import { UsersSearch } from './UsersSearch';

type PropsType = {};

export const Chats: React.FC<PropsType> = ()	=> {
	//отримати дані про ці чати

	return (
		<div className={cn(classes.Chats, 'container')}>
			<UsersSearch />
		</div>
	)
}
