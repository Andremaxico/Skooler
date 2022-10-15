import { ArrowDownOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import React, { RefObject, useState } from 'react';
import { scrollElementToBottom } from '../../utils/helpers/scrollElementToBottom';
import classes from './ScrollBottomBtn.module.scss';

type PropsType = {
	element: HTMLDivElement,
	unreadCount: number,
}

export const ScrollBottomBtn = React.forwardRef<HTMLButtonElement, PropsType>(({element, unreadCount}, ref) => {
	const scrollToBottomHeight = element.scrollHeight - element.clientHeight;
	const remainingScroll = element.scrollHeight - (element.scrollTop + element.clientHeight);
	const [ isBottom, setIsBottom ] = useState<boolean>(remainingScroll < 100);
	const [isShowing, setIsShowing] = useState<boolean>(false);

	let prevElScroll: number = scrollToBottomHeight;

	//visible / unvisible
 	element.addEventListener('scroll', debounce((e) => {
		let currScroll = element.scrollTop;
		const isInBottom = element.scrollHeight - (element.scrollTop + element.clientHeight) < 100;
		setIsBottom(isInBottom);

		if(currScroll < prevElScroll && !isInBottom) {
			setIsShowing(true);
		} else if(currScroll > prevElScroll)  {
			setIsShowing(false);
		}

		prevElScroll = element.scrollTop;
	}, 20));

	const scrollBottom = () => scrollElementToBottom(element, scrollToBottomHeight);

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
