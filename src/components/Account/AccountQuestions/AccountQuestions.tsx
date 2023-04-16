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

type PropsType = {
	uid: string,
};

export const AccountQuestions: React.FC<PropsType> = ({uid}) => {
	const questions = useSelector(selectCurrUserQuestions);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);

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
	}, [])

	console.log('condition', isOpen && !isLoading && listRef.current);

	return (
		<div className={classes.AccountQuestions}>
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
					<Preloader /> 
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
			{isOpen && !isLoading && listRef.current && 
			<ScrollBtn element={listRef.current} up={true} />}
		</div>
	)
}
