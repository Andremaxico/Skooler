import React, { StrictMode, Suspense } from 'react';
import { useContext, useEffect, useState } from 'react';
import './nullstyle.scss';
import classes from './App.module.scss';

import AppHeader from './components/Header';

import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from 'history';

import { Provider, useSelector } from 'react-redux';

import { store, useAppDispatch } from './Redux/store';
import { networkErrorStatusChanged, prevPageChanged, returnBtnShowStatusChanged } from './Redux/app/appReducer';
import { loginDataReceived, sendMyAccountData, setMyAccountData } from './Redux/account/account-reducer';

import Preloader from './UI/Preloader';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import MySchool from './components/MySchool';

import { selectFooterHeight, selectGlobalErrorState, selectHeaderHeight, selectNetworkError, selectPrevPage, selectUserAction } from './Redux/app/appSelectors';
import { NetworkError } from './UI/NetworkError';
import { AppFooter } from './components/AppFooter';
import Stream from './components/Stream';
import { NewPost } from './components/NewPost';
import { Post } from './components/Post';

import {
  Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material/styles';
import withSuspense from './utils/hoc/withSuspense';
import { ActionStatus } from './UI/ActionStatus';
import { theme } from './utils/theme';
import { FirebaseContext } from './main';
import Chat from './components/Chat';
import { Registration } from './components/Registration';
import { ResetPassword } from './components/Login/ResetPassword';
import dayjs from 'dayjs';
import { SearchUsers } from './components/SearchUsers';
import { getSuccessTextByTarget } from './utils/helpers/getSuccessTextByTarget';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { ErrorBanner } from './UI/ErrorBanner';

//const Chat = React.lazy(() => import('./components/Chat'));
const Chats = React.lazy(() => import('./components/Chats'));
const Login = React.lazy(() => import('./components/Login'))
const Account = React.lazy(() => import('./components/Account'));

//const SuspensedChat = withSuspense(Chat);
const SuspensedChats = withSuspense(Chats);
const SuspensedLogin = withSuspense(Login);
const SuspensedAccount = withSuspense(Account);


const App = () => {
  const { auth } = useContext(FirebaseContext);

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const networkError = useSelector(selectNetworkError);
  const userAction = useSelector(selectUserAction); 
  const prevPage = useSelector(selectPrevPage);
  const isGlobalError = useSelector(selectGlobalErrorState);

  const dispatch = useAppDispatch();

  //internet check
  const offlineHandler = () => {
    dispatch(networkErrorStatusChanged(`Перевірте з'єднання з мережею`));
  }
  const onlineHandler = () => {
    dispatch(networkErrorStatusChanged(null));
  }

  //online/ofline listeners
  useEffect(() => {

    window.addEventListener('offline', offlineHandler);
    window.addEventListener('online', onlineHandler);

    return () => {
      window.removeEventListener('offline', offlineHandler);
      window.removeEventListener('online', onlineHandler);
    }
  }, []);

  useEffect(() => {
    if(navigator.onLine) {
      onlineHandler();
    } else  {
      offlineHandler();
    }
    console.log('naviagtor online check', navigator.onLine);
  }, [navigator.onLine]);
  
  useEffect(() => {
    if(auth) {
      onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
          dispatch(loginDataReceived({...user}));
          await dispatch(setMyAccountData(user));	
        } else {
          console.log('logout');
        }
        setIsFetching(false);
      });
    }
  }, [auth])


  //footer&header height for padding bottom
  const footerHeight = useSelector(selectFooterHeight) || 0;
  const headerHeight = useSelector(selectHeaderHeight) || 0;


  //change prev page in state
  const location = useLocation();

  const [prevLocation, setPrevLocation] = useState<string>(location.pathname)

  //set prev page
  useEffect(() => {
    //if we on some page -> login -> login/... -> we logging and return to login/.. 
    //but have return to some page
    //so when we have login or registration in pathname, we dont setting prevPage 
    if(!location.pathname.includes('login') && !location.pathname.includes('registration')) {
      dispatch(prevPageChanged(prevLocation));
      //update location
      setPrevLocation(location.pathname);
    }
  }, [location]);

  //if on main page -> hide return btn
  useEffect(() => {
    if(location.pathname === '/') {
      dispatch(returnBtnShowStatusChanged(false)); 
    } else if(prevPage) {
      dispatch(returnBtnShowStatusChanged(true));
    }
  }, [location])

  if(isFetching) return <Preloader />  
  return (
    <div className={classes.App}>
        {isGlobalError && <ErrorBanner />}
        <AppHeader />
        <div
          className={classes.content} 
          style={{
            paddingTop: `${headerHeight}px`, 
            paddingBottom: `${footerHeight}px`,
          }}
        >
          <div className={classes.container} style={{flex: '1 1 auto'}}>
            {networkError && <NetworkError message={networkError || ''} />}
            <Suspense fallback={<Preloader />}>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/login/reset-password' element={<ResetPassword />} />
                <Route path='/registration' element={<Registration />} />
                <Route path='/chat' element={<Chat />}>
                  <Route path=':userId'/>
                </Route>
                <Route path='/chats' element={<Chats />} />
                {/* <Route path={`/chats/${GENERAL_CHAT_ID}`} element={<Chat />} /> */}
                <Route path='/account' element={<SuspensedAccount />}>
                  <Route path=':userId'/>
                </Route>
                <Route path="searchUsers">
                  <Route path=":searchTerm" element={<SearchUsers />} />
                </Route>
                <Route path='/post/:postId' element={<Post />} />
                <Route path='/myschool' element={<MySchool />}/>
                <Route path='/new-post' element={<NewPost />} />
                <Route path='/' element={<Stream />} />
              </Routes>
            </Suspense>
            
            {userAction &&
              <ActionStatus status={userAction.status} successText={getSuccessTextByTarget(userAction.target)} />
            }
          </div>
        </div>
        <AppFooter />
    </div>
  );
}


const AppContainer = () => {
  return (
    <StrictMode>  
      <HashRouter>
        <Provider store={store}>
          <CssVarsProvider theme={theme}>
            {/* <HistoryRouter history={createBrowserHistory()}> */}
              <App />
            {/* </HistoryRouter> */}
          </CssVarsProvider>
        </Provider>
      </HashRouter>
    </StrictMode>
  )  
}

export default AppContainer;
