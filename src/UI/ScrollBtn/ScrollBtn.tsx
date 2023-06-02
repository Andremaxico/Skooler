import { debounce } from 'lodash';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import { scrollElementToBottom } from '../../utils/helpers/scrollElementToBottom';
import classes from './ScrollBtn.module.scss';
import cn from 'classnames';

type PropsType = {
	element: HTMLDivElement,
	unreadCount?: number,
	up?: boolean,
	className?: string,
}

export const ScrollBtn = React.forwardRef<HTMLButtonElement, PropsType>(({element, unreadCount, up, className}, ref) => {
	const body = document.body;

	const scrollToBottomHeight = body.scrollHeight -   body.scrollTop + body.clientHeight;
	const remainingScroll = body.scrollHeight - (element.scrollTop + element.clientHeight);
	const [isBottom, setIsBottom ] = useState<boolean>(remainingScroll < 100);
	const [isShowing, setIsShowing] = useState<boolean>(false);
	const [prevUnreadCount, setPrevUnreadCount] = useState<number | undefined>(unreadCount);
	//const [prevScroll, setPrevScroll] = useState<number>(scrollToBottomHeight);

	useEffect(() => {
		let prevScroll = scrollToBottomHeight;
		const changeVisibility = debounce((e) => {
			let currScroll = window.scrollY;
			const isInBottom = body.scrollHeight - (currScroll + body.clientHeight) < 100;
			setIsBottom(isInBottom);

			//in down
			if(isInBottom) {
				setIsShowing(false);
				//scrolling up
			} else if(prevScroll >= currScroll)  {
				setIsShowing(false);
				//scrolling down
			} else if(prevScroll < currScroll) {
				setIsShowing(true);
			}
	
			prevScroll = currScroll;
		}, 15);

		if(!up) {
			//visible / unvisible
			window.addEventListener('scroll', changeVisibility);
		}

		return () => {
			window.removeEventListener('scroll', changeVisibility);
		}
	}, [element]);  

	useEffect(() => {
		if((unreadCount || 0) > (prevUnreadCount || 0) && !isBottom) {
			setIsShowing(true);
			setTimeout(() => {
				setIsShowing(false);
			}, 500)
		} 
	}, [unreadCount]);

	const scrollBottom = () => {
		scrollElementToBottom(element, scrollToBottomHeight);
		window.scrollTo({
			top: scrollToBottomHeight, 
		})
		console.log('clicked');
	}

	const scrollTop = () => {
		console.log('scroll top');
		window.scrollTo({
			top: 0,
		})
	}

	return (
		<div className={cn(classes.ScrollBtn, isBottom || !isShowing ? classes._hidden : '', className)}>
			<button ref={ref} className={classes.arrow} onClick={up ? scrollTop : scrollBottom}>
				{unreadCount && unreadCount > 0 && <div className={classes.unreadCount}>
					{unreadCount}
				</div>}
				<ExpandMoreIcon className={cn(classes.icon, up && classes._up)} />
			</button>
		</div>
	)
});
