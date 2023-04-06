import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import Link from 'antd/lib/typography/Link';
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

type PropsType = {
	accountData: ReceivedAccountDataType,
	setIsEdit: (value: boolean) => void,
};

export const AccountBody: React.FC<PropsType> = React.memo(({accountData}) => {
	const {
		fullName, birthDate, class: classNum, school, status, aboutMe, avatarUrl, rating
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
					className={classes.avatar} icon={<UserOutlined />} 
					src={ avatarUrl || loginData?.photoURL } alt='Фото користувача'
				/>
			</div>
			<p className={classes.about}>{aboutMe}</p>
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
					<Link href={school.website} title='Сайт школи' target='_blank' className={classes.school} >
						{school.institution_name}
					</Link>
				</li>
			</ul>
		</div>
	)
});
