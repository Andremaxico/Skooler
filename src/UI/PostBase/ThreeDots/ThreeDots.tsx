import React, { Ref, RefObject } from 'react';
import classes from './ThreeDots.module.scss';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu, Props } from 'material-ui-popup-state';
import { useAppDispatch } from '../../../Redux/store';
import { deleteAnswer, deleteQuestion} from '../../../Redux/stream/stream-reducer';

type PropsType = {
	qId: string,
	menuRef: RefObject<HTMLDivElement>,
	answerQId?: string,
};

export const ThreeDots = React.forwardRef<HTMLDivElement, PropsType>(({qId, menuRef, answerQId}, ref) => {
	const dispatch = useAppDispatch();

	const deleteQ = () => {
		if(answerQId) {
			dispatch(deleteAnswer(answerQId, qId))
		} else {
			dispatch(deleteQuestion(qId));
		}
	}
	const changeQ = () => {
		
	}

	return (
		<div className={classes.ThreeDots} ref={ref} id='dots-wrapper'>
			<PopupState variant="popover" popupId="demo-popup-menu">
				{(popupState) => (
					<React.Fragment>
						<button {...bindTrigger(popupState)}>
							<div className={classes.dot}></div>
						</button>
						<Menu {...bindMenu(popupState)} ref={menuRef} id='actions-menu'>
							<MenuItem onClick={() => {
								popupState.close();
								changeQ();
							}} className={classes.changeBtn}>Змінити</MenuItem>

							<MenuItem onClick={() => {
								popupState.close();
								deleteQ();
							}} className={classes.deleteBtn}>Видалити</MenuItem>
						</Menu>
					</React.Fragment>
				)}
			</PopupState>
		</div>
	)
})
