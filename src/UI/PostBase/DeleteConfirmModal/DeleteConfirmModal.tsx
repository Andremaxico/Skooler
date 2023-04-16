import { Button } from '@mui/joy';
import React from 'react';
import { Modal } from '../../Modal';
import classes from './DeleteConfirmModal.module.scss';

type PropsType = {
	isShow: boolean,
	deleteP: () => void,
	cancel: () => void,
};

export const DeleteConfirmModal: React.FC<PropsType> = ({isShow, deleteP, cancel}) => {
	return (
		<Modal isShow={isShow}>
			<div className={classes.DeleteConfirm}>
				<p className={classes.text}>Ви дійсно хочете видалити це питання?</p>
				<div className={classes.buttons}>
					<Button variant='outlined' className={classes.deleteBtn} onClick={deleteP}>Видалити</Button>
					<Button variant='outlined' className={classes.cancelBtn} onClick={cancel}>Скасувати</Button>
				</div>
			</div>
		</Modal>
	)
}
