import React, { Ref, RefObject, VoidFunctionComponent, useEffect, useRef, useState } from 'react';
import classes from './ThreeDots.module.scss';
import Button from '@mui/material/Button';
import PopupState, { bindTrigger, bindMenu, Props, bindPopover } from 'material-ui-popup-state';
import { useAppDispatch } from '../../../Redux/store';
import { deleteAnswer, deleteQuestion, editAnswer, editQuestion} from '../../../Redux/stream/stream-reducer';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { ChangePostModal } from '../ChangePostModal';
import Popover from '@mui/material/Popover';
import { Menu, MenuItem } from '@mui/material';

type PropsType = {
	qId: string,
	menuRef: RefObject<HTMLDivElement>,
	answerQId?: string,
	postText: string,
	isForOwner: boolean,
	setIsDotsContextOpened?: (v: boolean) => void,
};

export const ThreeDots = React.forwardRef<HTMLDivElement, PropsType>(({qId, menuRef, answerQId, postText, isForOwner, setIsDotsContextOpened}, ref) => {
	const [isDeleteConfirmShowing, setIsDeleteConfirmShowing] = useState<boolean>(false);
	const [isEditPostModalShowing, setIsEditPostModalShowing] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [isOpen, setIsOpen] = useState<boolean>(false);

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

	const id = isOpen ? 'postContextMenu' : undefined;

	const handleClose = () => {
		setAnchorEl(null);
	}

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const el = e.currentTarget;
		setAnchorEl(el);
	}

	//anchorEl -> open
	useEffect(() => {
		setIsOpen(Boolean(anchorEl))
	}, [anchorEl])

	//open -> notice up
 	useEffect(() => {
		if(setIsDotsContextOpened) setIsDotsContextOpened(isOpen)
	}, [isOpen])
	// const handlePopoverClick = (e: React.MouseEvent) =>{
	// 	const target = e.target as Element;
	// 	const isClickedOnMenu = target === menuRef.current;

	// 	if(!isClickedOnMenu) {
	// 		popupState.close();
	// 	}
	// }


	return (
		<div className={classes.ThreeDots} ref={ref} id='dots-wrapper'>
			<button onClick={handleClick}>
				<div className={classes.dot}></div>
			</button>
			<Popover
				id={id}
				anchorEl={anchorEl}
				open={isOpen}
				className={classes.popover}
				onClick={handleClose}
			>
				<Menu 
					open={isOpen}
					anchorEl={anchorEl}
					// onClose={closeDeleteConfirm} 
					// ref={menuRef}
					// className={classes.menu}
				>
					{isForOwner && 
						<>
							<MenuItem onClick={() => {
								openEditPostModal();
							}} className={classes.changeBtn}>Редагувати</MenuItem>
							<MenuItem onClick={() => {
								openConfirmDeleteModal();
							}} className={classes.deleteBtn}>Видалити</MenuItem>
						</>
					}

					<MenuItem onClick={() => {
						// openConfirmDeleteModal();
					}} className={classes.deleteBtn}>Заглушка</MenuItem>
				</Menu>
			</Popover>
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
