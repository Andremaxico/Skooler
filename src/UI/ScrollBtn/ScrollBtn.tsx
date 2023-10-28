import { debounce } from 'lodash';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import { scrollElementToBottom } from '../../utils/helpers/scrollElementToBottom';
import classes from './ScrollBtn.module.scss';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { selectFooterHeight } from '../../Redux/app/appSelectors';

type PropsType = {
	element: HTMLDivElement,
	unreadCount?: number,
	up?: boolean,
	className?: string,
	newMessageFormH: number,
	right: number,
}

export const ScrollBtn = React.forwardRef<HTMLButtonElement, PropsType>(({
	element, unreadCount, up, className, newMessageFormH, right
}, ref) => {

	const footerHeight = useSelector(selectFooterHeight);
	const remainingScroll = element.scrollHeight - (element.scrollTop + element.clientHeight);
	const [isBottom, setIsBottom ] = useState<boolean>(remainingScroll < 100);
	const [isShowing, setIsShowing] = useState<boolean>(false);
	const [bottomStyleValue, setBottomStyleValue] = useState<number>(0);
	const [prevUnreadCount, setPrevUnreadCount] = useState<number | undefined>(unreadCount);
	const [scrollToBottomHeight, setScrollToBottomHeight] = useState<number>(0);
	//const [prevScroll, setPrevScroll] = useState<number>(scrollToBottomHeight);

	useEffect(() => {
		let prevScroll = scrollToBottomHeight;
		const changeVisibility = debounce((e) => {
			let currScroll = element.scrollTop;
			const isInBottom = element.scrollHeight - (currScroll + element.clientHeight) < 100;
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
			element.addEventListener('scroll', changeVisibility);
		}

		return () => {
			element.removeEventListener('scroll', changeVisibility);
		}
	}, [element]);  

	//for setting 'bottom' style value
	useEffect(() => {
		const bottomValue = (footerHeight || 0) + newMessageFormH + 16;
		setBottomStyleValue(bottomValue);
	}, [footerHeight, newMessageFormH])

	//set scroll to bottom value
	useEffect(() => {
		console.log(element.scrollHeight, element.scrollTop, element.clientHeight);
		const value = element.scrollHeight - element.clientHeight;
		setScrollToBottomHeight(value);
	}, [element.scrollTop])

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
		element.scrollTo({
			top: scrollToBottomHeight, 
		})
		console.log('clicked');
	}

	const scrollTop = () => {
		console.log('scroll top');
		element.scrollTo({
			top: 0,
		})
	}

	return (
		<div 
			className={cn(
				classes.ScrollBtn, 
				isBottom || !isShowing ? classes._hidden : '', 
				className
			)}
			style={{
				bottom: `${bottomStyleValue}px`,
				right: `${right}px`
			}}
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
