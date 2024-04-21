import React, { useEffect, useRef } from 'react';
import classes from './AppFooter.module.scss';

import { Footer } from 'antd/lib/layout/layout';
import { NavLink } from 'react-router-dom';

//icons
import SchoolIcon from '@mui/icons-material/School';
import MessageIcon from '@mui/icons-material/Message';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import PersonIcon from '@mui/icons-material/Person';


import { IconButton } from '@mui/material';
import { FooterLink } from './FooterLink';
import HomeIcon from '@mui/icons-material/Home';
import { footerHeightReceived } from '../../Redux/app/appReducer';
import { useAppDispatch } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { selectAuthedStatus, selectMyAccountData } from '../../Redux/account/account-selectors';
import { LoginLink } from '../../UI/LoginLink';
type PropsType = {}; 

export const AppFooter: React.FC<PropsType> = ({}) => {
  const footerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const myAccountData = useSelector(selectMyAccountData);

  //isAuthed, beacause on the start small login icon -> big ask icon
  useEffect(() => {
    const footerHeight = footerRef.current?.offsetHeight || 0;

    dispatch(footerHeightReceived(footerHeight));
  }, [footerRef, myAccountData]);

	return (
    <footer style={{ textAlign: 'center' }} className={classes.AppFooter} ref={footerRef}>
      <nav className={classes.AppFooter__nav}>
        <FooterLink icon={HomeIcon} to='/'/>
        <FooterLink icon={SchoolIcon} to='/myschool'/>
        <FooterLink icon={myAccountData ? ContactSupportIcon : LoginLink} bigger to='/new-post'/>
        <FooterLink icon={MessageIcon} to='/chats' />
        <FooterLink icon={PersonIcon} to='/account'/>
      </nav>
    </footer>
	)
}
