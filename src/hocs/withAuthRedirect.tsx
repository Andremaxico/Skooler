import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { LoginDataType } from '../../../samurai-way/src/types/types';
import { auth } from '../firebase/firebaseApi';
import { selectMyLoginData } from '../Redux/account/account-selectors';

export function withAuthRedirect <P>(Component: React.ComponentType<P>) {
	const loginData = useSelector(selectMyLoginData);

	return (props: P & LoginDataType) => {
		//if user didn`t login -> navigate to login page
		if(!loginData) return <Navigate to='/login' replace={true}/>

		//if loggined
		return <Component {...props} />
	}
}