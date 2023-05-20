
import React from 'react';
import { useSelector } from 'react-redux';
import { selectMyLoginData } from '../../../Redux/account/account-selectors';
import { ReceivedAccountDataType } from '../../../utils/types';
import classes from './AccountBody.module.scss';

import SchoolIcon from '../../../assets/images/school-icon.png';
import BirthdayIcon from '../../../assets/images/birthday-icon.png';
import { addZero } from '../../../utils/helpers/formatters';
import { getStringDate } from '../../../utils/helpers/getStringDate';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import MessageIcon from '@mui/icons-material/Message';
import { Avatar, Button } from '@mui/joy';
import { Link } from 'react-router-dom';

type PropsType = {
	accountData: ReceivedAccountDataType,
	setIsEdit: (value: boolean) => void,
	isMy: boolean,
};

export const AccountBody: React.FC<PropsType> = React.memo(({accountData, isMy}) => {
	const {
		fullName, birthDate, class: classNum, school, status, aboutMe, avatarUrl, rating, uid
	} = accountData;
	const loginData = useSelector(selectMyLoginData);


	const date = new Date(birthDate.years, birthDate.months, birthDate.date)
	const birthDayDate = getStringDate(date.getTime());


	return (
		<div className={classes.AccountBody}>
			<div className={classes.AccountHeader}>
				<div className={classes.cover}>
					<div className={classes.editBtn}>
						<EditRoundedIcon className={classes.icon} />
					</div>
					<h1 className={classes.fullName}>{fullName}</h1>
				</div>
				<Avatar
					className={classes.avatar}
					src={ avatarUrl } alt='Фото користувача'
				/>
			</div>
			<p className={classes.about}>{aboutMe}</p>
			{ !isMy &&
				<div className={classes.buttons}>
					<Button color='primary' variant='outlined' startDecorator={<MessageIcon />} className={classes.btn}>
						<Link className={classes.link} to={`/chat/${uid}`}>
							Написати повідомлення
						</Link>
					</Button>
				</div>
			}
			<ul className={classes.AccountInfo}>
				<h3 className={classes.title}>Інформація</h3>
				<li className={classes.classNum}>
					<p>{classNum}</p>
				</li>
				<li className={classes.birthDate}>
					<span>{birthDayDate}</span> 
				</li>
				<li className={classes.rating}>
					<p>{rating}</p>
				</li>
				<li className={classes.AccountSchool}>
					<Link to={school.website} title='Сайт школи' target='_blank' className={classes.school} >
						{school.institution_name}
					</Link>
				</li>
			</ul>
		</div>
	)
});
