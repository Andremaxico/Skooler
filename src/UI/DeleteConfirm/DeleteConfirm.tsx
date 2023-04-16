import { Button } from '@mui/joy';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import React from 'react';
import classes from './DeleteConfirm.module.scss';

type PropsType = {
	target: string,
	isShow: boolean,
	onCancel: () => void,
	onDelete: () => void,
	onClose: () => void, 
};


export const DeleteConfirm: React.FC<PropsType> = ({target, isShow, onCancel, onDelete, onClose}) => {
  const handleDelete = () => {
    onDelete();
    onClose();
  }
  const handleCancel = () => {
    onClose();
  }

	return (
		<Dialog
        open={isShow}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Ви дійсно хочете видалити ${target}?`}
        </DialogTitle>
        <DialogActions>
          <Button variant='outlined' onClick={handleCancel}>Скасувати</Button>
          <Button variant='outlined' color='danger' onClick={handleDelete} autoFocus>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
	)
}
