import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { setMyAccount } from '../../Redux/account/account-reducer';
import { selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import { useAppDispatch } from '../../Redux/store';
import Preloader from '../../UI/Preloader';
import { AccountBody } from './AccountBody';
import { AccountForm } from './AccountForm';

type PropsType = {};

const Account: React.FC<PropsType> = ({}) => {
	const [isEdit, setIsEdit] = useState<boolean>(false)

	const myAccountData = useSelector(selectMyAccountData);
	const authData = useSelector(selectMyLoginData);

	const dispatch = useAppDispatch();
	//get account data
	useEffect(() => {
		if(authData) {
			dispatch(setMyAccount(authData));	
		}
	}, [authData])

	console.log('my account data', myAccountData);
	
	if(!authData) return <Navigate to='/login' replace={true}/>
	if(!myAccountData) return <Preloader />;

	return (
		<div>
			{!isEdit && myAccountData ?
				<AccountBody accountData={myAccountData}/>
			:
			<AccountForm accountData={myAccountData}/>
			}
		</div>
	)
}

export default Account