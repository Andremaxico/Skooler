import { User } from 'firebase/auth';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectMyLoginData } from '../Redux/account/account-selectors';

export function withAuthRedirect <P>(Component: React.ComponentType<P>) {
	const loginData = useSelector(selectMyLoginData);

	return (props: P & User) => {
		//if user didn`t login -> navigate to login page
		if(!loginData) return <Navigate to='/login' replace={true}/>

		//if loggined
		return <Component {...props} />
	}
}