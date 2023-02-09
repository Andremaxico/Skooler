import React, { useEffect, useRef, useState } from 'react';
import classes from './Posts.module.scss';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../Redux/store';
import { currPostAnswersReceived, currStreamScrollValueChanged, getNextPosts, searchedPostsReceived } from '../../../Redux/stream/stream-reducer';
import { selectCurrStreamScrollValue, selectIsSearchShowing, selectPosts, selectSearchedPosts, selectUserActionStatus } from '../../../Redux/stream/stream-selectors';
import { PostCard } from './PostCard';
import Preloader from '../../../UI/Preloader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink } from 'react-router-dom';

type PropsType = {
	isLoading: boolean,
};

export const Posts: React.FC<PropsType> = ({isLoading}) => {
	const [page, setPage] = useState<number>(1);
	const [openedAnswerFormQId, setOpenedAnswerFormQId] = useState<string | null>(null);

	const posts = useSelector(selectPosts);
	const searchedPosts = useSelector(selectSearchedPosts);
	const isSearching = useSelector(selectIsSearchShowing);
	const savedScrollValue = useSelector(selectCurrStreamScrollValue);

	const dispatch = useAppDispatch();

	const postsRef = useRef<HTMLDivElement>(null);

	const reloadStream = () => {
		dispatch(searchedPostsReceived(null));

		if(postsRef.current) {
			const postsDiv = postsRef.current;
			postsDiv.scrollTop = 100;
			console.log('scroll top ', postsRef.current.scrollTop, postsRef);
		}
	}
	//=============GET POSTS.===========	
	useEffect(() => {
		//set newPosts
		dispatch(getNextPosts(page));
	}, [page]);

	//==========SAVE SCROLL VALUE WHEN SEARCHING FORM VISIBILITY STATUS CHANGING========
	useEffect(() => {  
		console.log('scroll', postsRef);
		//is showing all posts
		if(!searchedPosts && postsRef.current) {
			dispatch(currStreamScrollValueChanged(postsRef.current.scrollTop || 0))
		}
	}, [isSearching]);

	const handleScroll = () => {
		const scrollToBottom = (postsRef.current?.scrollHeight || 0) - (postsRef.current?.scrollTop || 0);
		
		//if end => load next posts
		if(scrollToBottom < 50) {
			//set next posts page
			setPage((currPage) => currPage + 1);
		}
	}

	//========SCROLL EVENT LISTENER
	useEffect(() => {
		if(posts?.length || 0 > 10) {
			postsRef.current?.addEventListener('scroll', handleScroll);

			return () => {
				postsRef.current?.removeEventListener('scroll', handleScroll);
			}
		}
	}, [])

	if(isLoading) return <Preloader />;

	return (
		<div ref={postsRef} className={classes.Posts}>
			{searchedPosts && searchedPosts.length > 0 ?
				<>
					<div className={classes.returnBtn}>
						<button className={classes.btn} onClick={reloadStream}>
							<ArrowBackIcon className={classes.icon}/>
						</button>
					</div>
					{searchedPosts.map(data => (
						<PostCard data={data} key={data.id} isOpen={false}/>
					))}
				</>
			: searchedPosts == null && !!posts && posts.length || 0 > 0 ?
				posts?.map(data => (
					<PostCard 
						data={data} 
						key={data.id} 
						isOpen={false} 
						answeringQuestionId={openedAnswerFormQId}
						setAnsweringQuestionId={setOpenedAnswerFormQId}
					/>
				))
			: searchedPosts && searchedPosts?.length < 1 ?
				<div className={classes.noQuestions}>
					<button className={classes.btn} onClick={reloadStream}>
						<ArrowBackIcon className={classes.icon}/>
					</button>
					<p className={classes.text}>Нічого не знайдено</p>
				</div>
			: <div>Питань немає взагалі</div>
			}
		</div>
	)
}
