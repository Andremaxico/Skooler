import React from 'react';
import classes from './AccountHeader.module.scss';
import cn from 'classnames';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar } from '@mui/joy';
import { UserAvatar } from '../../../../UI/UserAvatar';

type PropsType = {
	className?: string,
	isMy: boolean,
	fullName: string,
	avatarUrl?: string | null,
	setIsEditing: (v: boolean) => void,
};

export const AccountHeader: React.FC<PropsType> = ({
	className, fullName, avatarUrl, setIsEditing, isMy
}) => {
	const handleEditBtnClick = () => {
		setIsEditing(true);
	}

	return (
		<div className={cn(classes.AccountHeader, className)}>
			<div className={classes.cover}>
				{isMy &&
					<button className={classes.editBtn} onClick={handleEditBtnClick}>
						<EditIcon className={classes.icon} />
					</button>
				}
				<h1 className={classes.fullName}>{fullName}</h1>
			</div>
			<UserAvatar
				className={classes.avatar}
				src={avatarUrl} 
				fullName={fullName}
				size='lg'
			/>	
		</div>
	)
}
