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

type PropsType = {
	isLoading: boolean,
};

export const Posts: React.FC<PropsType> = ({isLoading}) => {
	const [openedAnswerFormQId, setOpenedAnswerFormQId] = useState<string | null>(null);
	const [isPostsFetching, setIsPostsFetching] = useState<boolean>(false);

	const lastVisiblePost = useSelector(selectlastVisiblePost);
	const posts = useSelector(selectPosts);
	const searchedPosts = useSelector(selectSearchedPosts);
	const isSearching = useSelector(selectIsSearchShowing);
	const savedScrollValue = useSelector(selectCurrStreamScrollValue);

	const footerHeight = useSelector(selectFooterHeight) || 0;
	const headerHeight = useSelector(selectHeaderHeight) || 0;

	const dispatch = useAppDispatch();

	const postsRef = useRef<HTMLDivElement>(null);

	//run after back from search
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
<<<<<<< HEAD
			//if last vivisble post in not setted -> get first posts and show loader
=======
			//if last vivisble post in not setted -> get firest posts and show loader
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
			if(lastVisiblePost !== null) {
				const getFirstPosts = async () => {
					setIsPostsFetching(true);
					await dispatch(getNextPosts());
					setIsPostsFetching(false);
				}
				getFirstPosts();
			} else {
				//set newPosts
				dispatch(getNextPosts());
			}
		}
	}, [lastVisiblePost]);

	//==========SAVE SCROLL VALUE WHEN SEARCHING FORM VISIBILITY STATUS CHANGING========
	useEffect(() => {  
		console.log('scroll', postsRef);
		//is showing all posts
		if(!searchedPosts && postsRef.current) {
			dispatch(currStreamScrollValueChanged(postsRef.current.scrollTop || 0))
		}
	}, [isSearching]);

<<<<<<< HEAD
	//get next posts if at down
	const handleScroll = () => {
		// const triggerHeight = (postsRef.current?.scrollTop || 0) + (postsRef.current?.offsetHeight || 0);

		// if(triggerHeight >= (postsRef.current?.scrollHeight || 0) - 10) {
		// 	dispatch(getNextPosts());
		// }
	}

	//add listener if we have more than 10 posts
=======
	const handleScroll = () => {
		const triggerHeight = (postsRef.current?.scrollTop || 0) + (postsRef.current?.offsetHeight || 0);

		if(triggerHeight >= (postsRef.current?.scrollHeight || 0) - 10) {
			dispatch(getNextPosts());
		}
	}

>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
	useEffect(() => {
		if(posts && posts.length >= 10 && postsRef.current) {
			console.log('add event listener');
			postsRef.current.addEventListener('scroll', handleScroll);

			return () => {
				postsRef.current?.removeEventListener('scroll', handleScroll);
			}
		}
	}, [postsRef.current, posts])

	if(isLoading || isPostsFetching) return <Preloader />;

	return (
<<<<<<< HEAD
		<div ref={postsRef} className={classes.Posts} >
=======
		<div ref={postsRef} className={classes.Posts} style={{height: `calc(100vh - ${footerHeight + headerHeight + 32}px)`}}>
>>>>>>> f0a0e1dc5720320ac046ce0a9489471ff300868f
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
				<NoResults reloadStream={reloadStream} />
			: <div>Питань немає взагалі</div>
			}
		</div>
	)
}
