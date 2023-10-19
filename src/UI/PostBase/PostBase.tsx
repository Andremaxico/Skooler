
import { Avatar, CircularProgress } from '@mui/joy';
import React, { MouseEvent, useRef, useState } from 'react';
import { PostBaseType, QuestionCategoriesType } from '../../utils/types';
import classes from './PostBase.module.scss';
import cn from 'classnames';
import { PostDate } from '../PostDate';
import { useSelector } from 'react-redux';
import { selectMyAccountData } from '../../Redux/account/account-selectors';
import { ThreeDots } from './ThreeDots';
import { selectUserActionStatus } from '../../Redux/stream/stream-selectors';
import { ActionStatus } from '../ActionStatus';
import { UserAvatar } from '../UserAvatar';
//need default avatar

type PropsType = {
	data: PostBaseType,  
	category?: QuestionCategoriesType, 
	answerQId?: string,
	setIsDotsContextOpened?: (value: boolean) => void,
	onClick?: (e: MouseEvent) => void,
};

export const PostBase: React.FC<PropsType> = ({data, category, onClick, answerQId, setIsDotsContextOpened}) => {
	const [isHover, setIsHover] = useState<boolean>(true);

	const dotsRef = useRef<HTMLDivElement>(null); 
	const menuRef = useRef<HTMLDivElement>(null);

	//for showing loader insted of text
	const userAction = useSelector(selectUserActionStatus);

	const handleClick = (e: React.MouseEvent) => {
		const target = e.target as Element;
		const closestTarget = target.closest('div#dots-wrapper') || target.closest('#actions-menu');

		const isClickedOnDots = closestTarget !== null ? closestTarget === dotsRef.current || closestTarget === menuRef.current : false;
		
		if(!isClickedOnDots && onClick) onClick(e);
	}

	const myAccountData = useSelector(selectMyAccountData);

	const isShowingForOwner = myAccountData?.uid === data.authorId;

	const { authorAvatarUrl, authorFullname, text} = data;

	const isTextCutted = text.substring(text.length - 3) === '...';

	return (
		<div 
			className={classes.PostCard} 
			onClick={handleClick} 
			// onMouseEnter={isShowingForOwner ? () => setIsHower(true) : undefined}
			// onMouseLeave={isShowingForOwner ? () => setIsHower(false) : undefined}
		>
			<div className={classes.top}>
				<div className={classes.author}>
					<UserAvatar
						className={classes.avatar} 
						name={myAccountData?.name}
						surname={myAccountData?.surname}
						src={authorAvatarUrl}
						size='sm'
					/>
					<div className={classes.authorInfo}>
						<p className={classes.name}>{authorFullname}</p>
						<p className={classes.rating}>{data.authorRating}</p>
					</div>
				</div>
				<div className={classes.info}>
					{category && <div className={classes.category}>{category}</div>}
					<ThreeDots 
						answerQId={answerQId} 
						qId={data.id} 
						ref={dotsRef} 
						menuRef={menuRef}
						postText={data.text}
						isForOwner={isShowingForOwner}
						setIsDotsContextOpened={setIsDotsContextOpened}
					/>
				</div>
			</div>
			<p className={cn(classes.text, isTextCutted ? classes._cutted : '')}>
				{userAction?.target === data.id ?
					<CircularProgress className={classes.icon} size={'sm'} />
				: text
				}
			</p>
			{data.isEdited && <p className={classes.editedMark}>(Змінено)</p>}
		</div>
	)
}
