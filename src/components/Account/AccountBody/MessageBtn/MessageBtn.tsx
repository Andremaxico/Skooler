import React from 'react';
import classes from './MessageBtn.module.scss';
import cn from 'classnames';
import { Button } from '@mui/joy';
import { Link } from 'react-router-dom';
import MessageIcon from '@mui/icons-material/Message';

type PropsType = {
	className?: string,
	uid: string,
};

export const MessageBtn: React.FC<PropsType> = ({className, uid}) => {
	return (
		<div className={cn(classes.MessageBtn, className)}>
			<Button color='primary' variant='outlined' startDecorator={<MessageIcon />} className={classes.btn}>
				<Link className={classes.link} to={`/chat/${uid}`}>
					Написати повідомлення
				</Link>
			</Button>
		</div>
	)
}
