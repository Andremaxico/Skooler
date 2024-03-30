import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import classes from './Account.module.scss';
import { Navigate, useParams } from 'react-router-dom';
import { setAnotherUserAccount, setMyAccountData } from '../../Redux/account/account-reducer';
import { selectAccountIsFetching, selectAuthedStatus, selectCurrUserAccountData, selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import { useAppDispatch } from '../../Redux/store';
import Preloader from '../../UI/Preloader';
import { AccountBody } from './AccountBody';
import { AccountForm } from './AccountForm';
import { NoAccountData } from './NoAccountData';
import { AccountQuestions } from './AccountQuestions';

type PropsType = {};

const Account: React.FC<PropsType> = ({}) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isEditing, setIsEditing] = useState<boolean>(false);

	const myAccountData = useSelector(selectMyAccountData);
	const currUserAccountData = useSelector(selectCurrUserAccountData);

	const isFetching = useSelector(selectAccountIsFetching);
	const isAuthed = useSelector(selectAuthedStatus);

	const { userId } = useParams();

	const accountData = userId ? currUserAccountData : myAccountData;
	const isMy = !userId;

	useEffect(() => {
		setIsLoading(true);
		//if(!userId && !myAccountData) setIsEdit(true);
		if(userId) {
			dispatch(setAnotherUserAccount(userId));
		}
		setIsLoading(false);
		
	}, [userId]);

	console.log('axxoun data', accountData);

	const dispatch = useAppDispatch();

	console.log('is fetching', isFetching);

	if(!isAuthed) return <Navigate to='/login' replace={true}/>
	if(isFetching && isLoading || !myAccountData) return <Preloader />;
	return (
		<div className={classes.Account}>
			{
			!isEditing && accountData ?
				<>
					<AccountBody 
						accountData={accountData} 
						setIsEditing={setIsEditing}
						isMy={isMy}
					/>
					<AccountQuestions uid={accountData.uid} />
				</>
			: isMy ? (
				<AccountForm accountData={myAccountData} setIsEdit={setIsEditing}/>
				// <p>Тут має бути AccountForm</p>
			) 
			: <NoAccountData />
			}
		</div>
	)
}

export default Account