import React from 'react';
import classes from './UserAvatar.module.scss';
import cn from 'classnames';
import { Avatar } from '@mui/joy';
import { stringAvatar } from '../../utils/helpers/stringAvatar';

type PropsType = {
	className?: string,
	src?: string | null,
	name?: string,
	surname?: string,
	size?: 'sm' | 'md' | 'lg',
};



export const UserAvatar: React.FC<PropsType> = ({className, src, name, surname, size = 'sm'}) => {
	return (
		<>	
			{src ?
				<Avatar 
					className={cn(classes.UserAvatar, className, classes[size])} 
					src={src} 
					size={size}  
				/>
			: name && surname ?
				<Avatar 
					className={cn(classes.UserAvatar, className, classes[size])} 
					{...stringAvatar(name, surname)}
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
