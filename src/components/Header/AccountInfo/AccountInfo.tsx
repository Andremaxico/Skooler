import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserType } from '../../../utils/types';
import classes from './AccountInfo.module.scss';
import { FirebaseContext } from '../../../main';
import { signOut } from 'firebase/auth';
import { myAccountDataReceived, loginDataReceived, authStatusChanged } from '../../../Redux/account/account-reducer';
import { useAppDispatch } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { selectMyAccountData } from '../../../Redux/account/account-selectors';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Avatar, Menu, MenuItem} from '@mui/joy';
import cn from 'classnames';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

type PropsType = {
	loginData: UserType | null,
}

export const AccountInfo: React.FC<PropsType> = ({loginData}) => {
	const { auth } = useContext(FirebaseContext);
	const accountData = useSelector(selectMyAccountData);
	const navigate = useNavigate();

	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const dispatch = useAppDispatch();
	const signout = () => {
		console.log('sign out ui');
		dispatch(loginDataReceived(null));
		dispatch(myAccountDataReceived(null));
		dispatch(authStatusChanged(false));

		if(auth) {
			signOut(auth);
		}
	}

	const handleClose = () => {
		setAnchorEl(null);
	}

	const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if(!isMenuOpen) setIsMenuOpen(true);
		setAnchorEl(event.currentTarget);
	}

	return (
		<div className={classes.AccountInfo}>
			<Link to='/account'>
				<Avatar 
					src={accountData?.avatarUrl}
					className={classes.avatar} 
				/>
			</Link>


			<PopupState variant="popover" popupId="header-account-popover">
				{(popupState) => (
				<>
					<button {...bindTrigger(popupState)}>
						<KeyboardArrowDownIcon className={classes.moreBtn}/>
					</button>
					{/* <Popover
						className={classes.popover}
						{...bindPopover(popupState)}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
					>  */}
						<Menu 
							{...bindMenu(popupState)}
							className={classes.contextMenu}
						>
							<MenuItem
								className={classes.menuItem}
								onClick={() => {
									navigate('/account')
								}}
							>
								<PersonOutlineOutlinedIcon className={classes.icon} />
								Мій акаунт
							</MenuItem>

							<MenuItem 
								className={cn(classes.deleteBtn, classes.menuItem)}
								onClick={signout}
							>
								<LogoutOutlinedIcon className={classes.icon}/>
								Вийти
							</MenuItem>
						</Menu>
					{/* </Popover> */}
				</>
				)}
			</PopupState>
		</div>
	)
}
