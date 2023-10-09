import React, { MouseEvent, useRef, useState } from 'react';

import classes from './PostCard.module.scss';

//icons
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import GradeIcon from '@mui/icons-material/Grade';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import { addStarToQuestion, openPostDataReceived, removeStarFromQuestion } from '../../../../Redux/stream/stream-reducer';
import { useAppDispatch } from '../../../../Redux/store';
import { PostDataType } from '../../../../utils/types';
import { PostBase } from '../../../../UI/PostBase/PostBase';
import { addQuestionToLiked, removeQuestionFromLiked } from '../../../../Redux/account/account-reducer';
import { useSelector } from 'react-redux';
import { selectAuthedStatus, selectMyAccountData } from '../../../../Redux/account/account-selectors';
import cn from 'classnames';
import { selectCurrPostAnswers } from '../../../../Redux/stream/stream-selectors';
import { NewAnswer } from '../../../Post/NewAnswer';
import { PostDate } from '../../../../UI/PostDate';
import { LoginLink } from '../../../../UI/LoginLink';

//need default avatar

type PropsType = {
	data: PostDataType,
	isOpen: boolean,
	answeringQuestionId?: string | null,
	setAnsweringQuestionId?: (value: string) => void,
};

export const PostCard: React.FC<PropsType> = ({data, isOpen, answeringQuestionId, setAnsweringQuestionId}) => {
	const { commentsCount, category, isClosed, createdAt, ...baseData } = data;

	//for blocking native card onClick event if "three dots" menu opened
	//because instead of starting button's funcs, we navigating to /post
	const [isDotsContextOpened, setIsDotsContextOpened] = useState<boolean>(false);

	const [isLiking, setIsLiking] = useState<boolean>(false);
	const [isAnswerAdding, setIsAnswerAdding] = useState<boolean>(false);

	const isAnsweringQuestion = !isOpen ? data.id === answeringQuestionId : true;

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const starBtnRef = useRef<HTMLButtonElement>(null);
	const commentBtnRef = useRef<HTMLButtonElement>(null);

	const myAccountData = useSelector(selectMyAccountData); 
	const isAuthed = useSelector(selectAuthedStatus);

	//is current post liked from this account
	const isLiked = myAccountData?.liked?.includes(data.id) || false;

	//short text for card insteaf of full in Post
	const cuttedText = !isOpen && data.text.length > 175 ? `${data.text.slice(0, 150)}...` : data.text; 

	const likeQuestion = async () => {
		if(!isLiked) {
			setIsLiking(true);

			dispatch(addStarToQuestion(data.id));
			await dispatch(addQuestionToLiked(data.id));

			setIsLiking(false);

		} else if(isLiked) {
			setIsLiking(true);

			dispatch(removeQuestionFromLiked(data.id));
			await dispatch(removeStarFromQuestion(data.id));

			setIsLiking(false);

		}
	}

	const handleClick = (e: MouseEvent) => {
		const clickedEl = (e.target as Element).closest('button');
		const isClickedOnStarBtn = clickedEl === starBtnRef.current;
		const isClickedOnCommentBtn = clickedEl === commentBtnRef.current;

		//navigate to another page
		if(!isClickedOnStarBtn && !isClickedOnCommentBtn && !isDotsContextOpened   ) {
			dispatch(openPostDataReceived(data));

			navigate(`/post/${data.id}`);
		}

		//handle comment btn click
		if(isClickedOnCommentBtn) {
			handleCommentBtnClick();
		}
	}

	const handleCommentBtnClick = () => {
		if(isAuthed) {
			if(setAnsweringQuestionId) {
				setAnsweringQuestionId(data.id);
			}
			setIsAnswerAdding(true);
		} else {
			navigate('/login');
		}
	}

	return (
		<section className={cn(classes.PostCard, isClosed ? classes._closed : '')}>   

			<PostBase 
				data={{...baseData, text: cuttedText}} 
				category={category} 
				onClick={!isOpen ? handleClick : undefined}
				setIsDotsContextOpened={setIsDotsContextOpened}
			/>

			<div className={classes.buttons}>

				{isAuthed ? <div className={classes.stats}>

					{/* stars count */}
					<button 
						className={cn(classes.btn, isLiked ? classes._liked : '')} 
						onClick={likeQuestion}
						ref={starBtnRef}
						disabled={isLiking}
					>
						<p className={classes.number}>{data.stars}</p>
						<GradeIcon className={classes.icon}/>
					</button>

					{/* comments count */}
					<button className={cn(classes.btn, classes.commentsCount)}>
						<p className={classes.number}>{commentsCount || 0}</p>
						<QuestionAnswerIcon className={cn(classes.icon)}/>
					</button>
				</div> :
					<LoginLink component={LoginIcon}  />
				}
				<button className={classes.addCommentBtn} onClick={handleCommentBtnClick} ref={commentBtnRef}>
					{isAuthed ? 'Відповісти' : 'Увійдіть, щоб відповісти'}
				</button>
			</div>
			{isAnswerAdding && isAnsweringQuestion && <NewAnswer 
				cancelAnswer={() => setIsAnswerAdding(false)} 
				questionId={data?.id}
			/>}
			<PostDate createdAt={createdAt} closed={isClosed}/>
		</section>
	)
}
