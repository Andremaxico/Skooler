import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectMyAccountData } from '../../Redux/account/account-selectors';
import { useAppDispatch } from '../../Redux/store';
import { AccountBody } from './AccountBody';
import { AccountForm } from './AccountForm';

type PropsType = {};

const Account: React.FC<PropsType> = ({}) => {
	const [isEdit, setIsEdit] = useState<boolean>(false)

	const myAccountData = useSelector(selectMyAccountData);

	if(!myAccountData) return <div></div>;

	return (
		<div>
			{!isEdit ?
				<AccountBody accountData={myAccountData}/>
			:
			<AccountForm accountData={myAccountData}/>
			}
		</div>
	)
}

export default Account