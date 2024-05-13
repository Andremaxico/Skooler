import React from 'react';
import classes from './Links.module.scss';
import { Link, NavLink } from 'react-router-dom';

type PropsType = {};

export const Links: React.FC<PropsType> = ({}) => {
    return (
        <div className={classes.Links}>
            <NavLink to={'reset-password'} replace={true} className={classes.link}>
                Забули пароль?
            </NavLink>
            <NavLink 
                to={'/registration/1'} 
                replace={true} 
                className={`${classes.registerBtn} ${classes.link}`}
                
            >
                Зареєструватися
            </NavLink>
        </div>
    )
}
