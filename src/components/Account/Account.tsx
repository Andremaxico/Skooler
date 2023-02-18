import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import classes from './Account.module.scss';
import { Navigate, useParams } from 'react-router-dom';
import { setAnotherUserAccount, setMyAccount } from '../../Redux/account/account-reducer';
import { selectAccountIsFetching, selectAuthedStatus, selectCurrUserAccountData, selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import { useAppDispatch } from '../../Redux/store';
import Preloader from '../../UI/Preloader';
import { AccountBody } from './AccountBody';
import { AccountForm } from './AccountForm';
import { NoAccountData } from './NoAccountData';

type PropsType = {};

const Account: React.FC<PropsType> = ({}) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const myAccountData = useSelector(selectMyAccountData);
	const currUserAccountData = useSelector(selectCurrUserAccountData);

	const isFetching = useSelector(selectAccountIsFetching);
	const isAuthed = useSelector(selectAuthedStatus);

	const { userId } = useParams();

	console.log('user id', userId);
	console.log('curr user account data', currUserAccountData);


	const accountData = userId ? currUserAccountData : myAccountData;
	const isMy = !userId;

	const [isEdit, setIsEdit] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);
		if(!userId && !myAccountData) setIsEdit(true);
		if(userId) {
			dispatch(setAnotherUserAccount(userId));
		}
		setIsLoading(false);
	}, [userId]);

	console.log('axxoun data', accountData);

	const dispatch = useAppDispatch();

	console.log('is fetching', isFetching);

	if(!isAuthed) return <Navigate to='/login' replace={true}/>
	if(isFetching && isLoading) return <Preloader />;

	return (
		<div className={classes.Account}>
			{
			!isEdit && accountData ?
				<AccountBody accountData={accountData} />
			: isMy ? (
				<AccountForm accountData={myAccountData} setIsEdit={setIsEdit}/>
			) 
			: <NoAccountData />
			}
			
			{ isMy && <Button onClick={() => setIsEdit(!isEdit)}>
					{!isEdit ? 'Змінити дані профілю' : !!myAccountData ? 'Не зберігати зміни' : '' }
				</Button>
			}
		</div>
	)
}

export default Account