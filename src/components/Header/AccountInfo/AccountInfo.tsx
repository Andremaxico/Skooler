import { Avatar, Button, Dropdown, Menu } from 'antd';
import { CaretDownFilled, UserOutlined } from '@ant-design/icons';
import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UserType } from '../../../utils/types';
import classes from './AccountInfo.module.scss';
import { FirebaseContext } from '../../..';
import { Auth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { myAccountDataReceived, loginDataReceived, authStatusChanged } from '../../../Redux/account/account-reducer';
import { useAppDispatch } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { selectMyAccountData } from '../../../Redux/account/account-selectors';
import { SignoutIcon } from '../../../UI/Icons';

type PropsType = {
	loginData: UserType | null,
}

export const AccountInfo: React.FC<PropsType> = ({loginData}) => {
	const { auth } = useContext(FirebaseContext);
	const accountData = useSelector(selectMyAccountData);

	const dispatch = useAppDispatch();
	const signout = () => {
		console.log('sign out ui');
		if(auth) {
			signOut(auth);
		}
		dispatch(loginDataReceived(null));
		dispatch(myAccountDataReceived(null));
		dispatch(authStatusChanged(false));
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

	return (
		<div className={classes.AccountInfo}>
			<Link to='/account'>
				<Avatar 
					icon={<UserOutlined />} src={ 
						accountData?.avatarUrl || loginData?.photoURL
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
