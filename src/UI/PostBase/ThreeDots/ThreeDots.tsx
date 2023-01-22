import React, { Ref, RefObject, useState } from 'react';
import classes from './ThreeDots.module.scss';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu, Props } from 'material-ui-popup-state';
import { useAppDispatch } from '../../../Redux/store';
import { deleteAnswer, deleteQuestion, editAnswer, editQuestion} from '../../../Redux/stream/stream-reducer';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { ChangePostModal } from '../ChangePostModal';

type PropsType = {
	qId: string,
	menuRef: RefObject<HTMLDivElement>,
	answerQId?: string,
	postText: string,
};

export const ThreeDots = React.forwardRef<HTMLDivElement, PropsType>(({qId, menuRef, answerQId, postText}, ref) => {
	const [isDeleteConfirmShowing, setIsDeleteConfirmShowing] = useState<boolean>(false);
	const [isEditPostModalShowing, setIsEditPostModalShowing] = useState<boolean>(false);

	const dispatch = useAppDispatch();

	const openConfirmDeleteModal = () => {
		setIsDeleteConfirmShowing(true);
	}
	const openEditPostModal = () => {
		setIsEditPostModalShowing(true);
	}

	const closeDeleteConfirm = () => {
		setIsDeleteConfirmShowing(false);
	}
	const closeEditPostModal = () => {
		setIsEditPostModalShowing(false);
	}

	const deletePost = () => {
		if(answerQId) {
			dispatch(deleteAnswer(answerQId, qId))
		} else {
			dispatch(deleteQuestion(qId));
		}
		closeDeleteConfirm();
	}
	const changePost = (text: string) => {
		if(answerQId) {
			dispatch(editAnswer(qId, text))
		} else {
			dispatch(editQuestion(qId, text));
		}
		closeEditPostModal();
	}
 
	return (
		<div className={classes.ThreeDots} ref={ref} id='dots-wrapper'>
			<PopupState variant="popover" popupId="demo-popup-menu">
				{(popupState) => (
					<React.Fragment>
						<button {...bindTrigger(popupState)}>
							<div className={classes.dot}></div>
						</button>
						<Menu {...bindMenu(popupState)} onClose={closeDeleteConfirm} ref={menuRef} id='actions-menu'>
							<MenuItem onClick={() => {
								popupState.close();
								openEditPostModal();
							}} className={classes.changeBtn}>Редагувати</MenuItem>

							<MenuItem onClick={() => {
								popupState.close();
								openConfirmDeleteModal();
							}} className={classes.deleteBtn}>Видалити</MenuItem>
						</Menu>
					</React.Fragment>
				)}
			</PopupState>
			<DeleteConfirmModal 
				isShow={isDeleteConfirmShowing} 
				deleteP={deletePost} 
				cancel={closeDeleteConfirm}
			/>
			<ChangePostModal 
				isShow={isEditPostModalShowing}
				changeP={changePost}
				cancel={closeEditPostModal}
				prevText={postText}
				target={answerQId ? 'відповідь' : 'питання'}
			/>
		</div>
	)
})
