import React, { useEffect, useState } from 'react';
import classes from './ResetPassword.module.scss';
import { ResetEmailForm } from './ResetEmailForm/ResetEmailForm';
import { SuccessCheckmark } from '../../../UI/SuccessCheckmark';
import { ActionStatus } from '../../../UI/ActionStatus';
import { useSelector } from 'react-redux';
import { selectAuthActionsStatuses, selectAuthErrors } from '../../../Redux/account/account-selectors';
import { UserActionStatusType } from '../../../Redux/stream/stream-reducer';
import { authActionStatusRemoved, authErrorRemoved } from '../../../Redux/account/account-reducer';
import { useAppDispatch } from '../../../Redux/store';
import { useNavigate } from 'react-router-dom';

type PropsType = {}

export const ResetPassword: React.FC<PropsType> = ({}) => {
	const actionsStatuses = useSelector(selectAuthActionsStatuses);
	const authErrors = useSelector(selectAuthErrors);

	const actionStatus = actionsStatuses['reset_password'];
	const errorText = authErrors['reset_password']?.message;

	console.log('action status', actionStatus);

	const dispatch = useAppDispatch();

	const navigate = useNavigate();

	useEffect(() => {
		return () => {
			console.log('clear errors');
			dispatch(authErrorRemoved('reset_password'));
			dispatch(authActionStatusRemoved('reset_password'));
		}
	}, []);	

	//go to /login after success
	useEffect(() => {
		if(actionStatus === 'success') {
			//2s - hiding success mark(ActionStatus), after hide -> go to login
			setTimeout(() => {
				navigate('/login', {replace: true});
			}, 2000)
		}
	}, [actionsStatuses['reset_password']])

	return (
		<div className={classes.ResetPassword}>
			<div className={classes.content}>
				<h1 className={classes.title}>Відновлюємно пароль</h1>
				<ResetEmailForm 
					className={classes.form} 
				/>  
			</div>
			<ActionStatus
				status={actionStatus || null}
				successText='Лист відправлено на пошту!'
				errorText={errorText}
			/>
		</div>
	)
}
