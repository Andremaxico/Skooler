import React from 'react'
import { ReceivedAccountDataType } from '../../utils/types';
import classes from './ReadMessageUser.module.scss';
import Avatar from 'antd/lib/avatar/avatar';
import { UserOutlined } from '@ant-design/icons';

type PropsType = {
	userData: ReceivedAccountDataType,
};

export const ReadMessageUser: React.FC<PropsType> = ({userData}) => {
	const { fullName, avatarUrl } = userData;

	return (
		<div className={classes.ReadMessageUser}>
			<Avatar className={classes.avatar} src={avatarUrl} icon={<UserOutlined />} size={50}/>
			<p className={classes.name}>{fullName}</p>
		</div>
	)
}
