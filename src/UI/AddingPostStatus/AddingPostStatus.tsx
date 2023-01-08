import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { selectPostAddingStatus } from '../../Redux/stream/stream-selectors';
import classes from './AddingPostStatus.module.scss';
import cn from 'classnames';
import { PostAddingStatusType } from '../../Redux/stream/stream-reducer';

//icons
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { CircularProgress } from '@mui/joy';
import classNames from 'classnames';
import { selectFooterHeight } from '../../Redux/app/appSelectors';

type NonNullablePostAddingStatus = NonNullable<PostAddingStatusType>

type PropsType = {
	successText: string,
	status: PostAddingStatusType,
};

export const AddingPostStatus: React.FC<PropsType> = ({successText, status}) => {
	const footerHeight = useSelector(selectFooterHeight);

	const statusTextObj: {[key in NonNullablePostAddingStatus]: string} = {
		'error': 'Сталася помилка',
		'loading': 'Завантаження',
		'success': successText,
	}
	const statusIconsObj: {[key in NonNullablePostAddingStatus]: ReactElement} = {
		'error': <ErrorOutlineOutlinedIcon className={classes.icon} />,
		'loading': <CircularProgress className={classes.icon} size={'sm'} />,
		'success': <DoneOutlinedIcon className={classes.icon} />,
	}
	const statusClassname = status === 'loading' ? classes._loading :
		status === 'error' ? classes._error : classes._success;

	return (
		<div 
			className={cn(classes.AddingPostStatus, status !== null ? `${classes._show} ${statusClassname}` : '')}
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
