import React, { Ref, RefObject, useRef, useState } from 'react';
import classes from './ThreeDots.module.scss';
import Button from '@mui/material/Button';
import PopupState, { bindTrigger, bindMenu, Props, bindPopover } from 'material-ui-popup-state';
import { useAppDispatch } from '../../../Redux/store';
import { deleteAnswer, deleteQuestion, editAnswer, editQuestion} from '../../../Redux/stream/stream-reducer';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { ChangePostModal } from '../ChangePostModal';
import Popover from '@mui/material/Popover';
import { Menu, MenuItem } from '@mui/joy';

type PropsType = {
	qId: string,
	menuRef: RefObject<HTMLDivElement>,
	answerQId?: string,
	postText: string,
	isForOwner: boolean,
};

export const ThreeDots = React.forwardRef<HTMLDivElement, PropsType>(({qId, menuRef, answerQId, postText, isForOwner}, ref) => {
	const [isDeleteConfirmShowing, setIsDeleteConfirmShowing] = useState<boolean>(false);
	const [isEditPostModalShowing, setIsEditPostModalShowing] = useState<boolean>(false);

	//const [isPopupShowing, setIsPopupShowing] = useState<>(false);

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
 
	// const handlePopoverClick = (e: React.MouseEvent) =>{
	// 	const target = e.target as Element;
	// 	const isClickedOnMenu = target === menuRef.current;

	// 	if(!isClickedOnMenu) {
	// 		popupState.close();
	// 	}
	// }


	return (
		<div className={classes.ThreeDots} ref={ref} id='dots-wrapper'>
			<PopupState variant="popover" popupId="three-dots-popup">
				{(popupState) => (
					<React.Fragment>
						<button {...bindTrigger(popupState)}>
							<div className={classes.dot}></div>
						</button>
						{/* <Popover
							{...bindPopover(popupState)}
							className={classes.popover}
							onClick={(e: React.MouseEvent) =>{
								const target = e.target as Element;
								const isClickedOnMenu = target === menuRef.current;
						
								console.log('is clicked on menu', isClickedOnMenu, target);

								if(!isClickedOnMenu) {
									popupState.close();
								}
							}}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
						> */}
							<Menu 
								{...bindMenu(popupState)} 
								onClose={closeDeleteConfirm} 
								ref={menuRef}
								className={classes.menu}
							>
								{isForOwner && 
									<>
										<MenuItem onClick={() => {
											popupState.close();
											openEditPostModal();
										}} className={classes.changeBtn}>Редагувати</MenuItem>
										<MenuItem onClick={() => {
											popupState.close();
											openConfirmDeleteModal();
										}} className={classes.deleteBtn}>Видалити</MenuItem>
									</>
								}

								<MenuItem onClick={() => {
									// popupState.close();
									// openConfirmDeleteModal();
								}} className={classes.deleteBtn}>Заглушка</MenuItem>
							</Menu>
						{/* </Popover> */}
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
