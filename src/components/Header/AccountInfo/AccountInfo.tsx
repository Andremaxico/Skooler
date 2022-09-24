import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserType } from '../../../utils/types';
import classes from './AccountInfo.module.scss';
import { FirebaseContext } from '../../..';
import { Auth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { accountDataReceived, loginDataReceived } from '../../../Redux/account/account-reducer';
import { useAppDispatch } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { selectMyAccountData } from '../../../Redux/account/account-selectors';

type PropsType = {
	loginData: UserType | null,
}

export const AccountInfo: React.FC<PropsType> = ({loginData}) => {
	const { auth } = useContext(FirebaseContext);
	const accountData = useSelector(selectMyAccountData);

	const dispatch = useAppDispatch();
	const signout = () => {
		if(auth) {
			signOut(auth);
		}
		dispatch(loginDataReceived(null));
		dispatch(accountDataReceived(null));
	}

	if(!loginData) {
		return <NavLink to='/login' replace={true} className={classes.loginLink}>Login</NavLink>;
	}

	return (
		<div className={classes.AccountInfo}>
			<Link to='/account'>
				<Avatar 
					icon={<UserOutlined />} src={ 
						accountData?.avatarUrl || loginData.photoURL
					}
					className={classes.avatar} 
				/>
			</Link>

			<p className={classes.name}>
				{ accountData?.name || loginData.displayName}
			</p>

			<Button onClick={signout} type='primary' size='small'>Вийти</Button>
		</div>
	)
}
