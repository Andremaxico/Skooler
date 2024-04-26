import React from 'react';
import classes from './CancelConfirmModal.module.scss';
import { Modal } from '../../../UI/Modal';
import { Button } from '@mui/joy';

type PropsType = {
	isShow: boolean,
	setIsCancelled: (v: boolean) => void,
	cancelRegistration: () => void,
	closeModal: () => void,
}

export const CancelConfirmModal: React.FC<PropsType> = ({isShow, cancelRegistration, closeModal, setIsCancelled}) => {
	return (
		<Modal
			isShow={isShow}
		>
			<div className={classes.CancelConfirmModal}>
				<h2 className={classes.title}>Ви дійсно хочете скасувати реєстрацію?</h2>
				<div className={classes.buttons}>
					<Button 
						className={classes.btn} 
						color='danger' 
						onClick={() => cancelRegistration()}
					>
						Так
					</Button>
					<Button 
						className={classes.btn} 
						onClick={() => closeModal()}
						color='primary'
					>
						Ні
					</Button>
				</div>
			</div>
		</Modal>
	)
}
