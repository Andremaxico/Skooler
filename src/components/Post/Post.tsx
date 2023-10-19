import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectMyAccountData } from '../../Redux/account/account-selectors';
import { useAppDispatch } from '../../Redux/store';
import { currPostAnswersReceived, getOpenPostData, getPostAnswers } from '../../Redux/stream/stream-reducer';
import { selectCurrPostAnswers, selectOpenPostData } from '../../Redux/stream/stream-selectors';
import { PostDataType } from '../../utils/types';
import { PostCard } from '../Stream/Posts/PostCard';
import { Answer } from './Answer';
import classes from './Post.module.scss';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { selectFooterHeight } from '../../Redux/app/appSelectors';
import Preloader from '../../UI/Preloader';
import { NoAnswers } from './NoAnswers';

type PropsType = {
 
}

export const Post: React.FC<PropsType> = ({}) => {
	const [isFetching, setIsFetching] = useState<boolean>(true);

	const data = useSelector(selectOpenPostData);
	const answers = useSelector(selectCurrPostAnswers);
	const footerHeight = useSelector(selectFooterHeight);

	const params = useParams();

	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const returnToMain = () => {
		navigate('/');
	}

	//get from server if no in posts
	if(!data && params.postId) {
		//get post by id -> set redux -> selector in component
		dispatch(getOpenPostData(params.postId));
	}

	//need empty dependency for clear work
	useEffect(() => {
		//clear answers
		return () => {
			dispatch(currPostAnswersReceived(null));
		}
	}, [])

	//get answers
	useEffect(() => {
		const fetchAnswers = async () => {
			if(!answers && params.postId) {
				setIsFetching(true);
				await dispatch(getPostAnswers(params.postId));
				setIsFetching(false);
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

	if(!postData) return <Preloader />

	return (
		<section className={classes.Post}>
			{/* {data && <button className={classes.returnBtn} onClick={returnToMain} style={{bottom: `${footerHeight ? footerHeight : 0 + 28}px`}}>
				<ArrowBackIcon className={classes.icon}/>
			</button>} */}
			<PostCard 
				isOpen={true} 
				data={postData} 
			/>
			<div className={classes.comments}>
				{answers && answers.length > 0 &&
					<h3 className={classes.title}>Відповіді {'(' + answers?.length + ')'} </h3>
				}
				{answers?.length || 0 > 0 && answers ? 
					answers.map((answerData) => (
						<Answer 
							data={answerData} 
							key={answerData.id} 
							isForAskedUser={isForAskedUser}
							questionId={postData.id}
						/>
					))
				: 
					isFetching ? 
					<div className={classes.loaderWrap}>
						<Preloader />
					</div>
				: 
					<NoAnswers />
				}
			</div>
		</section>
	)
}
