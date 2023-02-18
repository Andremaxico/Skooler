import React, { useEffect, useRef } from 'react';
import classes from './AppFooter.module.scss';

import { Footer } from 'antd/lib/layout/layout';
import { NavLink } from 'react-router-dom';

//icons
import SchoolIcon from '@mui/icons-material/School';
import MessageIcon from '@mui/icons-material/Message';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { IconButton } from '@mui/material';
import { FooterLink } from './FooterLink';
import HomeIcon from '@mui/icons-material/Home';
import { footerHeightReceived } from '../../Redux/app/appReducer';
import { useAppDispatch } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { selectAuthedStatus } from '../../Redux/account/account-selectors';
import { LoginLink } from '../../UI/LoginLink';
type PropsType = {}; 

export const AppFooter: React.FC<PropsType> = ({}) => {
  const footerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const isAuthed = useSelector(selectAuthedStatus);

  //isAuthed, beacause on the start small login icon -> big ask icon
  useEffect(() => {
    const footerHeight = footerRef.current?.offsetHeight || 0;

    dispatch(footerHeightReceived(footerHeight));
  }, [footerRef, isAuthed]);

	return (
    <footer style={{ textAlign: 'center' }} className={classes.AppFooter} ref={footerRef}>
      <nav className={classes.AppFooter__nav}>
        <FooterLink icon={HomeIcon} to='/'/>
        <FooterLink icon={SchoolIcon} to='/myschool'/>
        <FooterLink icon={isAuthed ? ContactSupportIcon : LoginLink} bigger to='/new-post'/>
        <FooterLink icon={MessageIcon} to='/chat' />
        <FooterLink icon={MessageIcon} to='/chat'/>
      </nav>
    </footer>
	)
}
