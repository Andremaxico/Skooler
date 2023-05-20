import React from 'react'
import { ReceivedAccountDataType } from '../../utils/types';
import classes from './ReadMessageUser.module.scss';  
import { Avatar } from '@mui/joy';

type PropsType = {
	userData: ReceivedAccountDataType,
};

export const ReadMessageUser: React.FC<PropsType> = ({userData}) => {
	const { fullName, avatarUrl } = userData;

	return (
		<div className={classes.ReadMessageUser}>
			<Avatar className={classes.avatar} src={avatarUrl}/>
			<p className={classes.name}>{fullName}</p>
		</div>
	)
}
