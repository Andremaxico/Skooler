import { debounce } from 'lodash';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import { scrollElementToBottom } from '../../utils/helpers/scrollElementToBottom';
import classes from './ScrollBtn.module.scss';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { selectFooterHeight } from '../../Redux/app/appSelectors';

//for ScrollBtn you need to create wrapper component for position settings

type PropsType = {
	element?: HTMLElement,
	isWindow?: boolean,
	unreadCount?: number,
	up?: boolean,
	className?: string,
}

export const ScrollBtn = React.forwardRef<HTMLButtonElement, PropsType>(({
	element, unreadCount, up, className, isWindow
}, ref) => {
	const remainingScroll = element && !isWindow 
		? element.scrollHeight - (element.scrollTop + element.clientHeight) 
		: window.outerHeight - (window.screenY + window.innerHeight);

	const [isBottom, setIsBottom ] = useState<boolean>(remainingScroll < 100);
	const [isShowing, setIsShowing] = useState<boolean>(false);
	const [prevUnreadCount, setPrevUnreadCount] = useState<number | undefined>(unreadCount);
	const [scrollToBottomHeight, setScrollToBottomHeight] = useState<number>(0);
	//const [prevScroll, setPrevScroll] = useState<number>(scrollToBottomHeight);

	useEffect(() => {
		let prevScroll = scrollToBottomHeight;
		const changeVisibility = debounce((e) => {
			let currScroll = element && !isWindow 
				? element.scrollTop 
				: window.scrollY;
			const isInBottom = element && !isWindow 
				? element.scrollHeight - (currScroll + element.clientHeight) < 100
				: window.outerHeight - (currScroll + window.innerHeight) < 100;
			setIsBottom(isInBottom);

			const isInTop = element && !isWindow ? element.scrollTop : window.scrollY === 0;

			//in down
			if(!up) {
				if(isInBottom) {
					setIsShowing(false);
					//scrolling up
				} else if(prevScroll >= currScroll)  {
					setIsShowing(false);
					//scrolling down
				} else if(prevScroll < currScroll) {
					setIsShowing(true);
				}
			} else {
				setIsShowing(!isInTop);
			}
	
			prevScroll = currScroll;
		}, 15);

		//visible / unvisible
		if(element && !isWindow) {
			element.addEventListener('scroll', changeVisibility);
		} else {
			window.addEventListener('scroll', changeVisibility);
		}

		return () => {
			if(element && !isWindow) {
				element.removeEventListener('scroll', changeVisibility);
			} else {
				window.removeEventListener('scroll', changeVisibility);
			}
		}
	}, [element, window]);  

	//set scroll to bottom value
	useEffect(() => {
		//@ts-ignore
		//console.log(element.scrollHeight, element.scrollTop, element.clientHeight);
		const value = element && !isWindow 
			? element.scrollHeight - (element.clientHeight + element.scrollTop)
			: window.outerHeight - (window.innerHeight + window.scrollY);
		setScrollToBottomHeight(value);
	}, [element && !isWindow ? element.scrollTop : window.scrollY]);

	useEffect(() => {
		if((unreadCount || 0) > (prevUnreadCount || 0) && !isBottom) {
			setIsShowing(true);
			setTimeout(() => {
				setIsShowing(false);
			}, 500)
		} 
	}, [unreadCount]);

	const scrollBottom = () => {
		scrollElementToBottom(element || window, scrollToBottomHeight);
		(element || window).scrollTo({
			top: scrollToBottomHeight, 
		});
	}

	const scrollTop = () => {
		console.log('scroll top');
		(element || window).scrollTo({
			top: 0,
		})
	}

	return (
		<div 
			className={cn(
				classes.ScrollBtn, 
				(!up ? isBottom: false) || !isShowing ? classes._hidden : '', 
				className
			)}
		>
			<button ref={ref} className={classes.arrow} onClick={up ? scrollTop : scrollBottom}>
				{unreadCount && unreadCount > 0 && <div className={classes.unreadCount}>
					{unreadCount}
				</div>}
				<ExpandMoreIcon className={cn(classes.icon, up && classes._up)} />
			</button>
		</div>
	)
});
