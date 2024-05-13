import React, { useEffect, useState } from 'react'
import classes from './SearchUsers.module.scss'
import { useParams } from 'react-router-dom'
import { useAppDispatch } from '../../Redux/store';
import { searchUsersByFullname } from '../../Redux/users/users-reducer';
import { selectFoundUsers } from '../../Redux/users/users-selectors';
import { useSelector } from 'react-redux';
import { FoundUsers } from './FoundUsers/FoundUsers';
import Preloader from '../../UI/Preloader';
import { NoUsersFound } from './NoUsersFound';

type PropsType = {}

export const SearchUsers: React.FC<PropsType> = ({}) => {
    const [isLoading, setIsLoading] = useState(false);

    const foundUsers = useSelector(selectFoundUsers);

    const { searchTerm } = useParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(searchTerm) {
            ( async () => {
                setIsLoading(true);
                await dispatch(searchUsersByFullname(searchTerm));
                setIsLoading(false);
            })();
        }
    }, [searchTerm])
 
    if(isLoading) return <Preloader fixed />
    return (
        <section className={classes.SearchUsers}>
            {foundUsers && foundUsers.length > 0 ?
                <FoundUsers 
                    data={foundUsers}
                />
            :
                <NoUsersFound />
            }
        </section>
    )
}