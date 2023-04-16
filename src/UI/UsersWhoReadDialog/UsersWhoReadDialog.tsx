import React from 'react';
import classes from './UsersWhoReadDialog.module.scss';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import div from '@mui/material/div';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

type PropsType = {
	children: React.ReactNode,
	onClose: () => void,
	isOpen: boolean,
};


const BootstrapDialogTitle: React.FC<DialogTitleProps> = ({children, onClose, ...other}) => {
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other} className={classes.dialogTitle}>
      {children}
      {onClose ? (
        <div
          aria-label="close"
          onClick={onClose}
			 className={classes.closeBtn}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon className={classes.icon} />
        </div>
      ) : null}
    </DialogTitle>
  );
}

export const CustomizedDialogs: React.FC<PropsType> = ({children, onClose, isOpen}) => {
  return (
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
		  className={classes.Dialog}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          Переглянули
        </BootstrapDialogTitle>
        <DialogContent dividers className={classes.content}>
         	{children}
        </DialogContent>
      </BootstrapDialog>
  );
}
