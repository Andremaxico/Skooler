import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReceivedAccountDataType } from '../../../../utils/types';
import classes from './PupilCard.module.scss';

type PropsType = {
	data: ReceivedAccountDataType,
};

export const PupilCard: React.FC<PropsType> = ({data}) => {
	return (
		<div className={classes.PupilCard}>
			<NavLink to={`/account/${data.uid}`} replace={true}>
				<Avatar
					icon={<UserOutlined />} src={data.avatarUrl} 
					className={classes.avatar}
				/>
			</NavLink>
			<h3 className={classes.name}>{data.name} {data.surname}</h3>
		</div>
	)
}
