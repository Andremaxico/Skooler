import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { sendUserData, setUsersData } from '../../Redux/account/account-reducer';
import classes from './Account.module.scss';
import { AccountForm } from './AccountForm';

type PropsType = {};

const Account: React.FC<PropsType> = ({}) => {
	const dispatch = useDispatch();


	//test api
	useEffect(() => {
		dispatch(setUsersData() as unknown as AnyAction);
		//@ts-ignore
		// dispatch(sendUserData({ 'uid': {
		// 	class: 7,
		// 	status: 'schoolboy',
		// 	name: 'Andriy',
		// }}) as unknown as AnyAction)
	}, []);
	//test api

	return (
		<div>
			<AccountForm />
		</div>
	)
}

export default Account