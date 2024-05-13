import React from 'react';
import { ReceivedAccountDataType } from '../../utils/types';
import classes from './UserCard.module.scss';
import { getAgeFromDate } from '../../utils/helpers/date/getAgeFromDate';
import { Avatar } from '@mui/joy';
import { NavLink } from 'react-router-dom';

type PropsType = {
    data: ReceivedAccountDataType,
};

export const UserCard: React.FC<PropsType> = ({data}) => {
    const age = getAgeFromDate(new Date(data.birthDate.year));
    const ageStr = age.toString();

    console.log('user card data', data);
    return (
        <NavLink to={`/account/${data.uid}`} className={classes.UserCard}>
            <div className={classes.avatar}>
                <Avatar 
                    src={data.avatarUrl || undefined}
                    className={classes.img}
                    size='sm'
                />
            </div>
            <div className={classes.about}>
                <h4 className={classes.fullName}>{data.fullName}</h4>
                {data.aboutMe && data.aboutMe.length > 0 ? 
                    <p className={classes.aboutText}>
                        {data.aboutMe}
                    </p>
                :
                    <p className={classes.noAboutText}>
                        Користувач ще нічого не розповів про себе
                    </p>
                }
            </div>
        </NavLink>
    )
}
