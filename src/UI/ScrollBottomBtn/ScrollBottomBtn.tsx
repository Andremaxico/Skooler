import { ArrowDownOutlined } from '@ant-design/icons';
import { BoySharp } from '@mui/icons-material';
import { debounce } from 'lodash';
import React, { RefObject, useEffect, useState } from 'react';
import { scrollElementToBottom } from '../../utils/helpers/scrollElementToBottom';
import classes from './ScrollBottomBtn.module.scss';

type PropsType = {
	element: HTMLDivElement,
	unreadCount: number,
}

export const ScrollBottomBtn = React.forwardRef<HTMLButtonElement, PropsType>(({element, unreadCount}, ref) => {
	const body = document.body;

	const scrollToBottomHeight = body.scrollHeight + body.clientHeight;
	const remainingScroll = body.scrollHeight - (element.scrollTop + element.clientHeight);
	const [isBottom, setIsBottom ] = useState<boolean>(remainingScroll < 100);
	const [isShowing, setIsShowing] = useState<boolean>(false);
	const [prevScroll, setPrevScroll] = useState<number>(scrollToBottomHeight);

	useEffect(() => {
		const changeVisibility = debounce((e) => {
			let currScroll = window.scrollY;
			const isInBottom = body.scrollHeight - (currScroll + body.clientHeight) < 100;
			setIsBottom(isInBottom);
			console.log('is in bottom', isInBottom, 'is showing:', isShowing);

			if(currScroll < prevScroll && !isInBottom) {
				setIsShowing(true);
			} else if(currScroll > prevScroll)  {
				setIsShowing(false);
			}
	
			setPrevScroll(currScroll);
		}, 20);

		//visible / unvisible
		window.addEventListener('scroll', changeVisibility);

		return () => {
			window.removeEventListener('scroll', changeVisibility);
		}
	}, [element]);  


	const scrollBottom = () => {
		scrollElementToBottom(element, scrollToBottomHeight);
		window.scrollTo({
			top: scrollToBottomHeight, 
		})
		console.log('clicked');
	}

	return (
		<div className={`${classes.ScrollBottomBtn} ${isBottom && !isShowing ? classes._hidden : ''}`}>
			<button ref={ref} className={classes.arrow} onClick={scrollBottom}>
				{unreadCount > 0 && <div className={classes.unreadCount}>
					{unreadCount}
				</div>}
				<ArrowDownOutlined className={classes.icon} />
			</button>
		</div>
	)
});
