import React from 'react';
import classes from './FoundUsers.module.scss';
import { ReceivedAccountDataType } from '../../../utils/types';
import { UserCard } from '../../../UI/UserCard';

type PropsType = {
    data: ReceivedAccountDataType[],
}

export const FoundUsers: React.FC<PropsType> = ({data}) => {
  console.log('data', data);
  return (
    <ul className={classes.FoundUsers}>
        {data.map(userData => (
            <UserCard data={userData} />
        ))}
    </ul>
  )
};