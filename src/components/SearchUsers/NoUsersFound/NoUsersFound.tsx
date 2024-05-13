import React from 'react';
import classes from './NoUsersFound.module.scss';
import PersonOffIcon from '@mui/icons-material/PersonOff';

type PropsType = {};

export const NoUsersFound: React.FC<PropsType> = ({}) => {
    return (
        <div className={classes.NoUsersFound}>
            <PersonOffIcon className={classes.icon} />
            <p className={classes.text}>
                Користувачів за таким запитом не знайдено
            </p>
        </div>
    )
}
