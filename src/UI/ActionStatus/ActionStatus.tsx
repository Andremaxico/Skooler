import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './ActionStatus.module.scss';
import cn from 'classnames';
import { UserActionStatusType, UserActionType } from '../../Redux/stream/stream-reducer';

//icons
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { CircularProgress } from '@mui/joy';
import classNames from 'classnames';
import { selectFooterHeight } from '../../Redux/app/appSelectors';

type PropsType = {
	successText: string,
	errorText?: string,
	status: UserActionStatusType | null,
};

export const ActionStatus: React.FC<PropsType> = ({successText, status, errorText}) => {
	const [isShow, setIsShow] = useState<boolean>(!!successText);

	const footerHeight = useSelector(selectFooterHeight);

	//text for every status
	const statusTextObj: {[key in UserActionStatusType]: string} = {
		'error': `Сталася помилка${errorText ? ': ' + errorText : ''}`, 
		'loading': 'Опрацювання',
		'success': successText,
	}

	//icons next to text
	const statusIconsObj: {[key in UserActionStatusType]: ReactElement} = {
		'error': <ErrorOutlineOutlinedIcon className={classes.icon} />,
		'loading': <CircularProgress className={classes.icon} size={'sm'} />,
		'success': <DoneOutlinedIcon className={classes.icon} />,
	}

	//change status -> change styles
	const statusClassname = status === 'loading' ? classes._loading :
		status === 'error' ? classes._error : classes._success;

	//hide after 3s from show
	useEffect(() => {
		if(status === 'loading') {
			setTimeout(() => {
				setIsShow(false);
			}, 2000)
		} 
	}, [status]);

	//change visibility with status
	useEffect(() => {
		setIsShow(!!status);
	}, [status])
	
	return (
		<div 
			className={cn(classes.ActionStatus, isShow ? `${classes._show} ${statusClassname}` : '')}
			style={{
				bottom: `${footerHeight || 0 + 16}px`,
			}}
		>
			{status && 
				<div className={classes.body}>
					<p className={classes.text}>{statusTextObj[status]}</p>
					<div className={classes.icon}>
						{statusIconsObj[status]}
					</div>
				</div>
			}

		</div>
	)
}
