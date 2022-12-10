import React from 'react';
import classes from './AppFooter.module.scss';

import { Footer } from 'antd/lib/layout/layout';
import { NavLink } from 'react-router-dom';

//icons
import SchoolIcon from '@mui/icons-material/School';
import MessageIcon from '@mui/icons-material/Message';
import { IconButton } from '@mui/material';
import { FooterLink } from './FooterLink';
import HomeIcon from '@mui/icons-material/Home';
type PropsType = {}; 

export const AppFooter: React.FC<PropsType> = ({}) => {
	return (
		<div>
			<Footer style={{ textAlign: 'center' }} className={classes.AppFooter}>
          <nav className={classes.AppFooter__nav}>
            <FooterLink icon={HomeIcon} to='/'/>
            <FooterLink icon={SchoolIcon} to='/myschool'/>
            <FooterLink icon={MessageIcon} to='/chat' />
            <FooterLink icon={MessageIcon} to='/chat'/>
          </nav>
        </Footer>
		</div>
	)
}
