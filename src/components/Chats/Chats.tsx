import React, { useContext, useEffect } from 'react';
import classes from './Chats.module.scss';
import cn from 'classnames';
import { UsersSearch } from './UsersSearch';
import { useAppDispatch } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import { getChatsData, subscribeOnChats } from '../../Redux/chat/reducer';
import { selectChatsData } from '../../Redux/chat/selectors';
import { ChatsList } from './ChatsList';
import { FirebaseContext } from '../../main';
import { useNavigate } from 'react-router-dom';

type PropsType = {};

const Chats: React.FC<PropsType> = ({}) => {
	const navigate = useNavigate();

	//отримати дані про ці чати
	const dispatch = useAppDispatch();

	const myAccountData = useSelector(selectMyAccountData);
	const chatsData = useSelector(selectChatsData);
	const authData = useSelector(selectMyLoginData);

	//when we got account data -> subscribing on chat changed -> immediately get chats data
	useEffect(() => {
		dispatch(subscribeOnChats());
	}, [myAccountData?.uid]);


	if(!authData) navigate('/login', {replace: true});
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
