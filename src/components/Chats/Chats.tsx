import React, { useEffect } from 'react';
import classes from './Chats.module.scss';
import cn from 'classnames';
import { UsersSearch } from './UsersSearch';
import { useAppDispatch } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { selectMyAccountData } from '../../Redux/account/account-selectors';
import { getChatsData, subscribeOnChats } from '../../Redux/chat/reducer';
import { selectChatsData } from '../../Redux/chat/selectors';
import { ChatsList } from './ChatsList';

type PropsType = {};

const Chats: React.FC<PropsType> = ({})	=> {
	//отримати дані про ці чати

	const dispatch = useAppDispatch();

	const myAccountData = useSelector(selectMyAccountData);
	const chatsData = useSelector(selectChatsData);

	useEffect(() => {
		dispatch(subscribeOnChats());
	}, [myAccountData?.uid]);

	return (
		<div className={cn(classes.Chats, 'container')}>
			<UsersSearch />
			{chatsData ?
				<ChatsList chatsData={chatsData} />
			:
				<p>Немає розмов</p>
			}
		</div>
	)
}

export default Chats;
