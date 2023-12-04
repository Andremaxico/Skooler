import React from 'react';
import classes from './AccountHeader.module.scss';
import cn from 'classnames';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar } from '@mui/joy';
import { UserAvatar } from '../../../../UI/UserAvatar';

type PropsType = {
	className?: string,
	name: string,
	surname: string,
	avatarUrl?: string | null,
	setIsEditing: (v: boolean) => void,
};

export const AccountHeader: React.FC<PropsType> = ({
	className, name, surname, avatarUrl, setIsEditing
}) => {
	console.log('avatar url', avatarUrl);

	const handleEditBtnClick = () => {
		setIsEditing(true);
	}

	return (
		<div className={cn(classes.AccountHeader, className)}>
			<div className={classes.cover}>
				<button className={classes.editBtn} onClick={handleEditBtnClick}>
					<EditIcon className={classes.icon} />
				</button>
				<h1 className={classes.fullName}>{name} {surname}</h1>
			</div>
			<UserAvatar
				className={classes.avatar}
				src={avatarUrl} 
				name={name}
				surname={surname}
				size='lg'
			/>	
		</div>
	)
}
