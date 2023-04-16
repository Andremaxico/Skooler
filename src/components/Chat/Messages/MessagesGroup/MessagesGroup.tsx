import React from 'react';
import { Link } from 'react-router-dom';
import classes from './MessagesGroup.module.scss';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar } from '@mui/joy';
import { MessagesGroupMetadataType } from '../Messages';

type PropsType = {
	metadata: MessagesGroupMetadataType,
	listRef: React.RefObject<HTMLDivElement>,
	children: JSX.Element[],
}


export const MessagesGroup: React.FC<PropsType> = ({metadata, children, listRef}) => {
	return (
		<div className={classes.MessagesGroup}>
			{!metadata.isMy &&
				<div className={classes.avatar}>
					<Link to={`/account/${metadata.avatarData?.uid || ''}`}>
						<Avatar 
							src={metadata.avatarData?.photoUrl || undefined}
							className={classes.avatar}
						/>
					</Link>
				</div>
			}
			<div className={classes.messages}>
				{children}
			</div>
		</div>
	)
}
