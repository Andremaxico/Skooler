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

type PropsType = {
	accountData: ReceivedAccountDataType,
};

export const AccountBody: React.FC<PropsType> = React.memo(({accountData}) => {
	const {
		name, surname, birthDate, class: classNum, school, status, aboutMe, avatarUrl
	} = accountData;
	const loginData = useSelector(selectMyLoginData);


	const birthDayDate = `${addZero(birthDate.date)}.${addZero(birthDate.months)}.${addZero(birthDate.years)}`;

	return (
		<div className={classes.AccountBody}>
			<div className={classes.AccountHeader}>
				<div className={classes.cover}></div>
				<Avatar 
					className={classes.avatar} icon={<UserOutlined />} 
					src={ avatarUrl || loginData?.photoURL } alt='Фото користувача'
				/>
			</div>
			<div className={classes.AccountInfo}>
				<h1 className={classes.fullName}>{surname} { name}</h1>
				<p className={classes.classNum}>{classNum}</p>
			</div>
			<div className={classes.birthDate}>
				<div className={classes.icon}>
					<img src={BirthdayIcon} alt='cake img'/>
				</div>
				<span>{birthDayDate}</span> 
			</div>
			<p className={classes.status}>{status}</p>
			<p className={classes.about}>{aboutMe}</p>
			<div className={classes.AccountSchoo}>
				<Link href={school.website} title='Сайт школи' target='_blank' className={classes.school} >
					<div className={classes.icon}>
						<img src={SchoolIcon} alt='Школа: '/>
					</div>
					{school.institution_name}
				</Link>
			</div>
		</div>
	)
});
