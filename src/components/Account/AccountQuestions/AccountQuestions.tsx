import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { currUserQuestionsReceived, setUserQuestions } from '../../../Redux/account/account-reducer';
import { selectCurrUserQuestions } from '../../../Redux/account/account-selectors';
import { useAppDispatch } from '../../../Redux/store';
import Preloader from '../../../UI/Preloader';
import { PostCard } from '../../Stream/Posts/PostCard';
import classes from './AccountQuestions.module.scss';
import cn from 'classnames';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { ScrollBtn } from '../../../UI/ScrollBtn';
import { selectFooterHeight } from '../../../Redux/app/appSelectors';
import { ScrollBtnPositionType } from '../../../utils/types';
import { BASE_PAGE_PADDING } from '../../../utils/constants';

type PropsType = {
	uid: string,
};

export const AccountQuestions: React.FC<PropsType> = ({uid}) => {
	const questions = useSelector(selectCurrUserQuestions);
	const footerHeight = useSelector(selectFooterHeight);


	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [scrollBtnPosition, setScrollBtnPosition] = useState<ScrollBtnPositionType | null>(null);

	const listRef = useRef<HTMLDivElement>(null);

	const dispatch = useAppDispatch();
	useEffect(() => {
		const getQuestions = async () => {
			setIsLoading(true);
			await dispatch(setUserQuestions(uid));
			setIsLoading(false);
		}
		if(!questions) {
			getQuestions();
		}
	}, [isOpen]);

	//null questions after close
	useEffect(() => {
		return () => {
			dispatch(currUserQuestionsReceived(null));
		}
	}, []);

	useEffect(() => {
		if(footerHeight && listRef.current) {
			const right = listRef.current.offsetLeft;
			const bottom = footerHeight + BASE_PAGE_PADDING;

			setScrollBtnPosition({
				right, 
				bottom
			});
		}
	}, [footerHeight, listRef.current]);

	useEffect(() => {
		console.log('body scroll top', window.document.body.scrollTop);
	}, [window.document.body.scrollTop]);

	console.log('condition', isOpen && !isLoading && listRef.current);

	return (
		<div 
			className={classes.AccountQuestions}
		>
			<button 
				className={cn(classes.top, isOpen && classes._open)} 
				onClick={() => setIsOpen(open => !open)}
			>
				<h2 className={classes.title}>Запитання {questions && `(${questions.length})`}</h2>
				<KeyboardArrowDownRoundedIcon className={classes.arrow} />
			</button>
			<div 
				className={cn(classes.questionsList, isOpen && classes._open)}
				ref={listRef}
			>

				{  
				isLoading ? 
					<Preloader absolute /> 
				: 
				questions ? 
					questions.map(data => (
						<PostCard
							data={data}
							isOpen={false}
							key={data.id}
						/>
					))
				:
					<p className={classes.noQuestions}>Немає запитань</p>
				}
			</div>
			{isOpen && !isLoading && window.document.body && 
				<div 
					className={classes.ScrollBtnWrap}
					style={{
						position: 'fixed',
						bottom: `${scrollBtnPosition?.bottom || 0}px`,
						right: `${scrollBtnPosition?.right || 0}px`
					}}
				>
					<ScrollBtn 
						isWindow up={true} 
					/>
				</div>
			}
		</div>
	)
}
