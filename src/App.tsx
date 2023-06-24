import React, { Suspense } from 'react';
import { useContext, useEffect, useState } from 'react';
import './nullstyle.scss';
import classes from './App.module.scss';

import AppHeader from './components/Header';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';

import { Provider, useSelector } from 'react-redux';

import { store, useAppDispatch } from './Redux/store';
import { networkErrorStatusChanged, prevPageChanged, returnBtnShowStatusChanged } from './Redux/app/appReducer';
import { loginDataReceived, setMyAccountData } from './Redux/account/account-reducer';

import Preloader from './UI/Preloader';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Auth, onAuthStateChanged } from 'firebase/auth';
import MySchool from './components/MySchool';

import { selectFooterHeight, selectHeaderHeight, selectNetworkError, selectPrevPage } from './Redux/app/appSelectors';
import { NetworkError } from './UI/NetworkError';
import { AppFooter } from './components/AppFooter';
import Stream from './components/Stream';
import { NewPost } from './components/NewPost';
import { Post } from './components/Post';

import {
  Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material/styles';
import withSuspense from './utils/hoc/withSuspense';
import { selectUserActionStatus } from './Redux/stream/stream-selectors';
import { ActionStatus } from './UI/ActionStatus';
import { theme } from './utils/theme';
import { FirebaseContext } from './main';
import Chat from './components/Chat';
import { Registration } from './components/Registration';
import { ResetPassword } from './components/Login/ResetPassword';

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

  const networkError = useSelector(selectNetworkError);
  const userAction = useSelector(selectUserActionStatus); 
  const prevPage = useSelector(selectPrevPage);

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

  //get login data 
  // useEffect(() => {
  //   console.log('user', user);
  //   setIsFetching(true);
  //   const getLoginData = async () => {
  //     if(user) {
  //       dispatch(loginDataReceived({...user}));
  //       await dispatch(setMyAccountData(user));	
  //     }
  //   }
  //   getLoginData();
  //   setIsFetching(false);
  // }, [user]);

  //set account data
  useEffect(() => {
    if(auth) {
      onAuthStateChanged(auth, async (user) => {
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


  //footer&header height for padding botton
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

  //if(!loading && !user) return <Login />; 
  return (
    <div className={classes.App}>
        <AppHeader />
        <div
          className={classes.content} 
          style={{
            paddingTop: `${headerHeight   }px`, 
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
                <Route path='/account' element={<SuspensedAccount />}>
                  <Route path=':userId'/>
                </Route> 
                <Route path='/post/:postId' element={<Post />} />
                <Route path='/myschool' element={<MySchool />}/>
                <Route path='/new-post' element={<NewPost />} />
                <Route path='/' element={<Stream />} />
              </Routes>
            </Suspense>
            
            {userAction?.target === 'post_adding' &&
                <ActionStatus status={userAction.status} successText='Питання успішно додано'/>
              || 
              userAction?.target === 'answer_adding' && 
                <ActionStatus status={userAction.status} successText='Відповідь успішно додана' />
              ||
              userAction?.target === 'post_deleting' &&
                <ActionStatus status={userAction.status} successText='Питання видалено'/>
              ||
              userAction?.target === 'answer_deleting' &&
                <ActionStatus status={userAction.status} successText='Відповідь видалено'/>
            }
          </div>
        </div>
        {!location.pathname.includes('/chat/') && <AppFooter />}
    </div>
  );
}


const AppContainer = () => {
  return (
    <HashRouter>
      <Provider store={store}>
        <CssVarsProvider theme={theme}>
          <App />
        </CssVarsProvider>
      </Provider>
    </HashRouter>
  )
}

export default AppContainer;
