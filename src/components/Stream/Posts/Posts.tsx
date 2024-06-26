import React, { useEffect, useRef, useState } from 'react';
import classes from './Posts.module.scss';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../Redux/store';
import { allPostsReceived, currPostAnswersReceived, currStreamScrollValueChanged, getNextPosts, searchedPostsReceived } from '../../../Redux/stream/stream-reducer';
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
import { PostsList } from './PostsList';

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
			//u todo: understand this
			const postsDiv = postsRef.current;
			postsDiv.scrollTop = 100;
			console.log('scroll top ', postsRef.current.scrollTop, postsRef);
		}
	}

	//=============GET POSTS===========	
	useEffect(() => {
		//if first posts -> loader
		if(!posts) {
			//if last vivisble post in not setted 
			//-> get first posts and show loader
			console.log('last visible post', lastVisiblePost, isPostsFetching);
			if(lastVisiblePost === null && !isPostsFetching) {
				const getFirstPosts = async () => {
					console.log('get first posts');
					setIsPostsFetching(true);
					await dispatch(getNextPosts());
					setIsPostsFetching(false);
				}

				getFirstPosts();
			}
		}

		//first posts fetching twice, 
		//because we visit /(1x) -> /login -> /(2x) 
		//we need to clear posts in login page
		// return () => {
		// 	dispatch(allPostsReceived(null));
		// }
	}, []);


	//if user see last post -> fetch new
	useEffect(() => {
		console.log('is in view', inView);
		if(inView && !isPostsFetching) {
			//set newPosts
			console.log('last visible post', lastVisiblePost);
			const fetchPosts = async () => {
				setIsPostsFetching(true);
				console.log('fetch posts');
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

	useEffect(() => {
		console.log('posts first', posts ? posts[0] : 'no posts');
	}, [posts]);

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

	console.log(isLoading, 'is loadiing', isPostsFetching, 'isPostsFetching');

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
					<PostsList 
						ref={isInViewRef}
						openedAnswerFormQId={openedAnswerFormQId}
						setOpenedAnswerFormQId={setOpenedAnswerFormQId}
						posts={posts}
					/>
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
