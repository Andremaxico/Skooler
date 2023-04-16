import React, { ComponentType, ReactElement } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from 'react-router-dom';
import classes from './LoginLink.module.scss';


type PropsType = {
	component: ComponentType<{}>,
}

export const LoginLink: React.FC<PropsType> = ({component: Component = LoginIcon}) => {
	return (
		<Link to='/login' className={classes.LoginLink}>
			<Component className={classes.icon} />
		</Link>
	)
}
