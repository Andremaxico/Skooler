import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { setAnotherUserAccount, setMyAccount } from '../../Redux/account/account-reducer';
import { selectAccountIsFetching, selectCurrUserAccountData, selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import { useAppDispatch } from '../../Redux/store';
import Preloader from '../../UI/Preloader';
import { AccountBody } from './AccountBody';
import { AccountForm } from './AccountForm';

type PropsType = {};

const Account: React.FC<PropsType> = ({}) => {
	const myAccountData = useSelector(selectMyAccountData);
	const currUserAccountData = useSelector(selectCurrUserAccountData);

	const authData = useSelector(selectMyLoginData);
	const isFetching = useSelector(selectAccountIsFetching);

	const { userId } = useParams();

	const accountData = userId ? currUserAccountData : myAccountData;
	const isMy = !userId;

	const [isEdit, setIsEdit] = useState<boolean>(isMy ? !!myAccountData : false);

	useEffect(() => {
		if(userId) {
			dispatch(setAnotherUserAccount(userId));
		}
	}, [userId]);

	const dispatch = useAppDispatch();

	console.log('is fetching', isFetching);

	if(!authData) return <Navigate to='/login' replace={true}/>
	if(isFetching) return <Preloader />;

	return (
		<div>
			{
			!isEdit && accountData ?
				<AccountBody accountData={accountData} />
			:
				<AccountForm accountData={accountData} setIsEdit={setIsEdit}/>
			}
			
			{ isMy && <Button onClick={() => setIsEdit(!isEdit)}>
					{!isEdit ? 'Змінити дані профілю' : !!myAccountData ? 'Не зберігати зміни' : '' }
				</Button>}
		</div>
	)
}

export default Account