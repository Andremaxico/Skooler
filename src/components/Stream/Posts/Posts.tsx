import React, { useEffect, useRef, useState } from 'react';
import classes from './Posts.module.scss';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../Redux/store';
import { currPostAnswersReceived, currStreamScrollValueChanged, getNextPosts, searchedPostsReceived } from '../../../Redux/stream/stream-reducer';
import { selectCurrStreamScrollValue, selectIsSearchShowing, selectlastVisiblePost, selectPosts, selectSearchedPosts, selectUserActionStatus } from '../../../Redux/stream/stream-selectors';
import { PostCard } from './PostCard';
import Preloader from '../../../UI/Preloader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink } from 'react-router-dom';
import { NoResults } from './NoResults';
import { selectFooterHeight, selectHeaderHeight } from '../../../Redux/app/appSelectors';
import { useInView } from 'react-intersection-observer';
import { debounce } from 'lodash';
import { Tumbleweed } from '../../../UI/Tumbleweed';

type PropsType = {
	isLoading: boolean,
};

export const Posts: React.FC<PropsType> = ({isLoading}) => {
	const [openedAnswerFormQId, setOpenedAnswerFormQId] = useState<string | null>(null);
	const [isPostsFetching, setIsPostsFetching] = useState<boolean>(true);
	

	const lastVisiblePost = useSelector(selectlastVisiblePost);
	const posts = useSelector(selectPosts);
	const searchedPosts = useSelector(selectSearchedPosts);
	const isSearching = useSelector(selectIsSearchShowing);
	const savedScrollValue = useSelector(selectCurrStreamScrollValue);

	const { ref: isInViewRef, inView, entry  } = useInView({
		threshold: 0.7,
	});

	const footerHeight = useSelector(selectFooterHeight) || 0;
	const headerHeight = useSelector(selectHeaderHeight) || 0;

	const dispatch = useAppDispatch();

	const postsRef = useRef<HTMLDivElement>(null);

	//run after back from search
	//for showing all posts
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
		//if first posts -> loader
		if(!posts) {
			//if last vivisble post in not setted 
			//-> get first posts and show loader
			if(lastVisiblePost === null) {
				const getFirstPosts = async () => {
					await dispatch(getNextPosts());
				}

				getFirstPosts();
			}
		}
	}, []);

	useEffect(() => {
		console.log('is in view', inView);
		if(inView) {
			//set newPosts
			const fetchPosts = async () => {
				setIsPostsFetching(true);
				await dispatch(getNextPosts());
				setIsPostsFetching(false);
			}
			fetchPosts();
		}
	}, [inView])

	//==========SAVE SCROLL VALUE WHEN SEARCHING FORM VISIBILITY STATUS CHANGING========
	useEffect(() => { 
		//is showing all posts
		if(!searchedPosts && postsRef.current) {
			dispatch(currStreamScrollValueChanged(postsRef.current.scrollTop || 0))
		}
	}, [isSearching]);

	//get next posts if at down
	// const handleScroll = debounce(() => {
	// 	const scrollTop = window.scrollY;
	// 	const clientHeight = postsRef.current?.clientHeight;
	// 	const scrollHeight = postsRef.current?.scrollHeight;
	// 	console.log('handle scroll', scrollTop, clientHeight, scrollHeight);
	// 	const triggerHeight = (scrollTop || 0) + (clientHeight || 0);

	// 	if(triggerHeight >= (scrollHeight || 0) - 10) {
	// 		dispatch(getNextPosts());
	// 	}
	// }, 20);

	//add listener if we have more than 10 posts
	// useEffect(() => {
	// 	if(posts && posts.length >= 10) {
	// 		window.addEventListener('scroll', handleScroll);
	// 		console.log('add event listener');
	// 		return () => {
	// 			window.removeEventListener('scroll', handleScroll);
	// 		}
	// 	}
	// }, [posts])

	useEffect(() => {
		console.log('is posts fetching', isPostsFetching);
	}, [isPostsFetching]);

	if(isLoading || posts === null) return <Preloader fixed />;

	return (
		<div 
			ref={postsRef} 
			className={classes.Posts} 
			// style={{
			// 	paddingBottom: 
			// 		postsRef.current?.scrollHeight || 0 > document.body.clientHeight ? 
			// 		footerHeight : 
			// 		0
			// }}
		>
			{searchedPosts && searchedPosts.length > 0 ?
				<>  
					<div className={classes.returnBtn}>
						<button className={classes.btn} onClick={reloadStream}>
							<ArrowBackIcon className={classes.icon}/>
						</button>
					</div>
					{searchedPosts.map(data => (
						<PostCard data={data} key={`search${data.id}`} isOpen={false}/>
					))}
				</>
			: searchedPosts == null && !!posts && posts.length || 0 > 0 ?
				<>
					{posts?.map(data => (
						<PostCard 
							data={data} 
							key={data.id} 
							isOpen={false} 
							ref={isInViewRef}
							answeringQuestionId={openedAnswerFormQId}
							setAnsweringQuestionId={setOpenedAnswerFormQId}
						/>
					))}
					{isPostsFetching &&
						<div className={classes.loaderBox}>
							<Preloader width={20} height={20} />
						</div>
					}
				</>
			: searchedPosts && searchedPosts?.length < 1 ?
				<NoResults reloadStream={reloadStream} />
			: 
				<Tumbleweed />
			}
		</div>
	)
}
