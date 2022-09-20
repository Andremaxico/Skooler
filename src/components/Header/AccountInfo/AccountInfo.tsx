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

type PropsType = {
	loginData: UserType | null,
}

export const AccountInfo: React.FC<PropsType> = ({loginData}) => {
	const { auth } = useContext(FirebaseContext);

	const dispatch = useAppDispatch();
	const signout = () => {
		signOut(auth as Auth);
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
					icon={<UserOutlined />} src={loginData.photoURL}
					className={classes.avatar} 
				/>
			</Link>

			<p className={classes.name}>{loginData.displayName}</p>

			<Button onClick={signout} type='primary' size='small'>Logout</Button>
		</div>
	)
}
