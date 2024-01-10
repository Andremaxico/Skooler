import React, {useRef, useEffect, useState} from 'react'
import { NavLink, unstable_useBlocker as useBlocker, useLocation } from 'react-router-dom';
import { AccountInfo } from './AccountInfo';
import classes from './Header.module.scss';
import { useSelector } from 'react-redux';
import { selectMyAccountData, selectMyLoginData } from '../../Redux/account/account-selectors';
import logo from '../../assets/images/logo.png';
import { useAppDispatch } from '../../Redux/store';
import { headerHeightReceived, returnBtnShowStatusChanged } from '../../Redux/app/appReducer';
import { SearchButtons } from './SearchButtons';
import { ReturnBtn } from './ReturnBtn';
import { selectPrevPage, selectReturnBtnShowStatus } from '../../Redux/app/appSelectors';
import LoginIcon from '@mui/icons-material/Login';
import { IconButton } from '@mui/joy';
import cn from 'classnames';
import { SearchUsersForm } from './SearchUsersForm';


type PropsType = {};

const AppHeader: React.FC<PropsType> = ({}) => {
	const [isSearchUsersFormShow, setIsSearchUsersFormShow] = useState<boolean>(false);

	const loginData = useSelector(selectMyLoginData);
	const myAccountData = useSelector(selectMyAccountData);
	const isReturnBtnShow = useSelector(selectReturnBtnShowStatus);
	const prevPage = useSelector(selectPrevPage);

	const headerRef = useRef<HTMLDivElement>(null);

	const { pathname } = useLocation();

	const dispatch = useAppDispatch();

	const closeSearchUsersForm = () => {
		setIsSearchUsersFormShow(false);
	}

	useEffect(() => {
		const headerHeight = headerRef.current?.clientHeight || 0;
		dispatch(headerHeightReceived(headerHeight));
	}, [headerRef]);

	useEffect(() => {
		console.log('prev page', prevPage === pathname);
		if(prevPage === pathname)  {
			dispatch(returnBtnShowStatusChanged(false));
		} else {
			dispatch(returnBtnShowStatusChanged(true));
		}
	}, [prevPage, pathname])

	return (
		<header 
			className={cn(
				classes.AppHeader, 
				isSearchUsersFormShow ? classes._showInput : ''
			)} 
			ref={headerRef} 
			id='appHeader'
		>
			<div className={classes.buttons}>
				{/* {isReturnBtnShow && <ReturnBtn />} */}
				<SearchButtons 
					setIsSearchUserFormShow={setIsSearchUsersFormShow}
					isUsersSearching={isSearchUsersFormShow}
				/>
			</div>
			{ isSearchUsersFormShow ?
				<SearchUsersForm closeForm={closeSearchUsersForm} />
			:
				<>
					<NavLink to={'/'} className={classes.logo}>
						<img src={logo} alt='Skooler'/>
					</NavLink>
					{/* <AppMenu mode='horizontal' /> */}
					<div className={classes.accountLink} id='headerAccountLink'>
						{myAccountData ? 
							<AccountInfo loginData={loginData} />
						: !pathname.includes('registration') &&
							<NavLink to='/login' className={classes.loginLink}>
								<LoginIcon className={classes.icon} />
							</NavLink>
						}
					</div>
				</>
			}
		</header>
	)
}

export default AppHeader;
