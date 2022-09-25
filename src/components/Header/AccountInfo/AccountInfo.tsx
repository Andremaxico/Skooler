import { Avatar, Button, Dropdown, Menu } from 'antd';
import { CaretDownFilled, UserOutlined } from '@ant-design/icons';
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
import { SignoutIcon } from '../../../icons/Icons';

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

	//contex menu items fo arrow more btn
	const menu = (
		<Menu
		  items={[
				{
					label: <div className={classes.myAccountLink}>
						<UserOutlined /> <NavLink to='account' className={classes.toAccountLink} replace={true}>Мій профіль</NavLink>
					</div>,
					key: '1',
				},
				{
					label: <Button 
								onClick={signout} type='primary' danger size='small' 
								className={classes.signoutBtn}
							> <SignoutIcon className={classes.signOutIcon}/>  Вийти</Button>,
					key: 'signout',
				},
		  ]}
		/>
	 );

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

			<Dropdown overlay={menu} trigger={['click']}>
				<CaretDownFilled className={classes.moreBtn}/>
			</Dropdown>

		</div>
	)
}
