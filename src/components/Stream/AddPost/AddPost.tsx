<<<<<<< HEAD
import { IconButton } from '@mui/joy';
=======
import { IconButton, TextField } from '@mui/material';
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
import React, { useEffect } from 'react';
import classes from './AddPost.module.scss';

import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { Navigate, useNavigate } from 'react-router-dom';

type PropsType = {};

export const AddPost: React.FC<PropsType> = ({}) => {
	const navigate = useNavigate()

	useEffect(() => {
		console.log('add post mounted');
	}, []);

	const handleClick = () => {
		console.log('add post button clicked');
		navigate('/new-post');
	}

	return (
		<div className={classes.AddPost} >
			<IconButton 
				aria-label="add question" 
				onClick={handleClick}
				className={classes.btn}
				color='primary'
			>
				<ContactSupportIcon className={classes.icon} />
			</IconButton>
		</div>
	)
}
