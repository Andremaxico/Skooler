import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserType } from '../../../utils/types';
import classes from './AccountInfo.module.scss';
import { FirebaseContext } from '../../..';
import { Auth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

type PropsType = {
	accountData: UserType | null,
}

export const AccountInfo: React.FC<PropsType> = ({accountData}) => {
	const { auth } = useContext(FirebaseContext);
	const [ userData ] = useAuthState(auth as Auth);

	if(!userData) {
		return <NavLink to='/login' replace={true} className={classes.loginLink}>Login</NavLink>;
	}

	return (
		<div className={classes.AccountInfo}>
			<Link to='/account'>
				<Avatar 
					icon={<UserOutlined />} src={userData.photoURL}
					className={classes.avatar} 
				/>
			</Link>

			<p className={classes.name}>{userData.displayName}</p>

			<Button onClick={() => signOut(auth as Auth)} type='primary' size='small'>Logout</Button>
		</div>
	)
}
