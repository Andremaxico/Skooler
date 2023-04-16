import cn from 'classnames';
import React from 'react';
import { PostBase } from '../../../UI/PostBase/PostBase';
import { CommentType } from '../../../utils/types';
import classes from './Answer.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useAppDispatch } from '../../../Redux/store';
import { addClosedQuestionMark, addCorrentAnswerMark } from '../../../Redux/stream/stream-reducer';
import { PostDate } from '../../../UI/PostDate';
import { userAnswerMarkedAsCorrect } from '../../../Redux/account/account-reducer';
type PropsType = {
	data: CommentType,
	isForAskedUser: boolean,
	questionId: string,
};

export const Answer: React.FC<PropsType> = ({data, isForAskedUser, questionId}) => {
	const dispatch = useAppDispatch();

	const markAsCorrect = () => {
		//to answer
		dispatch(addCorrentAnswerMark(questionId, data.id));
		//to question
		dispatch(addClosedQuestionMark(questionId));
		//to user(account)
		dispatch(userAnswerMarkedAsCorrect(data.authorId));
	}

	return (
		<div className={cn(classes.Answer, data.isCorrect ? classes._correct : '')}>
			<PostBase data={data} answerQId={questionId} />
			<div className={classes.buttons}>
				{isForAskedUser && !data.isCorrect && <button className={classes.btn} onClick={markAsCorrect}>
					<CheckCircleOutlineIcon className={classes.icon} />
					<p className={classes.text}>Правильно</p>
				</button>}
				{data.isCorrect && <div className={classes.correctMark}>
					<CheckCircleRoundedIcon className={classes.icon} />
				</div>}
				<button className={classes.btn}>
					<p className={classes.number}></p>	
					<FavoriteIcon className={classes.icon}/>
					<p className={classes.text}>Дякую!</p>
				</button>
			</div>
			<PostDate createdAt={data.createdAt} closed={data.isCorrect} />
		</div>
	)
}
