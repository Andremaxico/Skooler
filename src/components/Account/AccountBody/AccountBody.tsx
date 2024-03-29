
import React from 'react';
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../../Redux/account/account-selectors';
import { ReceivedAccountDataType } from '../../../utils/types';
import classes from './AccountBody.module.scss';

import SchoolIcon from '../../../assets/images/school-icon.png';
import BirthdayIcon from '../../../assets/images/birthday-icon.png';
import { addZero } from '../../../utils/helpers/formatters';
import { getStringDate } from '../../../utils/helpers/date/getStringDate';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import MessageIcon from '@mui/icons-material/Message';
import { Avatar, Button } from '@mui/joy';
import { Link } from 'react-router-dom';
import { AccountInfo } from './AccountInfo';
import { AccountHeader } from './AccountHeader';
import { MessageBtn } from './MessageBtn';

type PropsType = {
	accountData: ReceivedAccountDataType,
	setIsEditing: (value: boolean) => void,
	isMy: boolean,
};

export const AccountBody: React.FC<PropsType> = React.memo(({accountData, isMy, setIsEditing}) => {
	const {
		aboutMe, avatarUrl, uid, fullName
	} = accountData;

	return (
		<div className={classes.AccountBody}>
			<AccountHeader
				avatarUrl={avatarUrl}
				setIsEditing={setIsEditing}
				fullName={fullName}
				isMy={isMy}
				className={classes.header}
			/>

			<p className={classes.about}>{aboutMe}</p>

			{ !isMy && <MessageBtn uid={uid} className={classes.messageBtn}/>}

			<AccountInfo accountData={accountData} className={classes.info}/>
		</div>
	)
});
