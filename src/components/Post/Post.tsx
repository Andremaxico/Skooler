import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectMyAccountData } from '../../Redux/account/account-selectors';
import { useAppDispatch } from '../../Redux/store';
import { currPostAnswersReceived, getNextPosts, getOpenPostData, getPostAnswers } from '../../Redux/stream/stream-reducer';
import { selectAnswerAddingStatus, selectCurrPostAnswers, selectOpenPostData, selectPosts } from '../../Redux/stream/stream-selectors';
import { PostDataType } from '../../utils/types';
import { PostCard } from '../Stream/Posts/PostCard';
import { Answer } from './Answer';
import { NewAnswer } from './NewAnswer';
import classes from './Post.module.scss';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { selectFooterHeight } from '../../Redux/app/appSelectors';
import Preloader from '../../UI/Preloader';
import { ActionStatus } from '../../UI/ActionStatus';

type PropsType = {

}

export const Post: React.FC<PropsType> = ({}) => {
	const [isFetchingAnswers, setIsFetchingAnswers] = useState<boolean>(false);

	const answerAddingStatus = useSelector(selectAnswerAddingStatus);
	const data = useSelector(selectOpenPostData);
	const answers = useSelector(selectCurrPostAnswers);
	const footerHeight = useSelector(selectFooterHeight);

	const params = useParams();

	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const returnToMain = () => {
		navigate('/');
	}
	console.log('params', params.postId, 'data', data);
	//get from server if no in posts
	if(!data && params.postId) {
		dispatch(getOpenPostData(params.postId));
	}

	//need empty dependency for clear work
	useEffect(() => {
		//clear answers
		return () => {
			dispatch(currPostAnswersReceived(null));
		}
	}, [])

	useEffect(() => {
		const fetchAnswers = async () => {
			if(data) {
				setIsFetchingAnswers(true);
				await dispatch(getPostAnswers(data.id));
				setIsFetchingAnswers(false);
			}
		}
		fetchAnswers();
	}, [data]);

	const [postData, setPostData] = useState<PostDataType | null>(data);

	useEffect(() => {
		setPostData(data);
	}, [data]);


	const myAccountdata = useSelector(selectMyAccountData);
	const isForAskedUser = data?.authorId === myAccountdata?.uid;

	if(!postData) return <div>Loading</div>

	return (
		<section className={classes.Post}>
			<ActionStatus successText='Відповідь успішно додана' status={answerAddingStatus} />
			{data && <button className={classes.returnBtn} onClick={returnToMain} style={{bottom: `${footerHeight ? footerHeight : 0 + 28}px`}}>
				<ArrowBackIcon className={classes.icon}/>
			</button>}
			<PostCard 
				isOpen={true} 
				data={postData} 
			/>
			<div className={classes.comments}>
				{answers?.length || 0 > 0 && answers ? 
					answers.map((answerData) => (
						<Answer 
							data={answerData} 
							key={answerData.id} 
							isForAskedUser={isForAskedUser}
							questionId={postData.id}
						/>
					))
				: isFetchingAnswers ? 
					<Preloader />
				:
					<div className={classes.noAnswers}>
						Поки що ніхто не знає відповіді...
					</div>
				}
			</div>
		</section>
	)
}
