import React from 'react';
import classes from './UserAvatar.module.scss';
import cn from 'classnames';
import { Avatar } from '@mui/joy';
import { stringAvatar } from '../../utils/helpers/stringAvatar';

type PropsType = {
	className?: string,
	src?: string | null,
	fullName: string,
	size?: 'sm' | 'md' | 'lg',
};



export const UserAvatar: React.FC<PropsType> = ({className, src, fullName, size = 'sm'}) => {
	return (
		<>	
			{src ?
				<Avatar 
					className={cn(classes.UserAvatar, className, classes[size])} 
					src={src} 
					size={size}  
				/>
			: fullName ?
				<Avatar 
					className={cn(classes.UserAvatar, className, classes[size])} 
					{...stringAvatar(fullName)}
					size={size}
				/>
			:
				<Avatar 
					className={cn(classes.UserAvatar, className, classes[size])} 
					size={size}
				/>
			}
		</>
	)
}
