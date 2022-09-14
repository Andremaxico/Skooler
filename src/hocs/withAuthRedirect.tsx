import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseApi';

export function withAuthRedirect <P>(Component: React.ComponentType<P>) {
	return (props: P) => {
		const [ user ] = useAuthState(auth);

		if(user) return <Component {...props as P} />

		return <Navigate to='/login' replace={true}/>
	}
}