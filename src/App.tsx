import { useContext, useEffect, useState } from 'react';
import './nullstyle.scss';
import "antd/dist/antd.css";
import classes from './App.module.scss';

import AppHeader from './components/Header';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';


import { Provider, useSelector } from 'react-redux';


import Layout, { Content, Footer } from 'antd/lib/layout/layout';
import { store, useAppDispatch } from './Redux/store';
import Account from './components/Account';
import { networkErrorStatusChanged } from './Redux/app/appReducer';
import { loginDataReceived, setMyAccount } from './Redux/account/account-reducer';

import Preloader from './UI/Preloader';
import { FirebaseContext } from '.';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Auth, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import MySchool from './components/MySchool';

import { Sidebar } from './components/Sidebar';
import { selectNetworkError } from './Redux/app/appSelectors';
import { NetworkError } from './UI/NetworkError';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { Registration } from './components/Registration';
import { createTheme, ThemeProvider } from '@mui/material';
import { AppFooter } from './components/AppFooter';
import Stream from './components/Stream';
import { NewPost } from './components/NewPost';
import { Post } from './components/Post';

//mui theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#61764B',

    },
    secondary: {
      main: '#9BA17B',
    },
    
  },
})


const App = () => {
  const { auth } = useContext(FirebaseContext);
  const [ user, loading ] = useAuthState(auth as Auth);

  const [isFetching, setIsFetching] = useState<boolean>(loading);
  const networkError = useSelector(selectNetworkError);

  const dispatch = useAppDispatch();

  const offlineHandler = () => {
    dispatch(networkErrorStatusChanged(`Перевірте з'єднання з мережею`));
    console.log('browser is offline');
  }
  const onlineHandler = () => {
    dispatch(networkErrorStatusChanged(null));
    console.log('browser is online');
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
  }, [navigator.onLine])

  console.log('app is fetching', isFetching);

  console.log('start user', user);

  //get login data 
  useEffect(() => {
    const getLoginData = async () => {
      if(user) {
        await dispatch(loginDataReceived({...user}));
        await dispatch(setMyAccount(user));	
        setIsFetching(false);
      } else {
        setTimeout(() => {
          setIsFetching(false);
        }, 1500)
      }
    }
    getLoginData();
    
  }, [user]);

  if(loading) return <Preloader />
  if(!loading && !user) return <Registration />;

  return (
    <Layout>
        <AppHeader />
        <Content className={classes.Content} style={{paddingTop: '64px'}}>
          <div className="site-layout-content" style={{flex: '1 1 auto'}}>
            {networkError && <NetworkError message={networkError || ''} />}
            {isFetching || loading ? <Preloader /> :
              <Routes>
                <Route path='/login' element={<Login />}/>
                <Route path='/chat' element={<Chat />}/>
                <Route path='/account' element={<Account />}>
                  <Route path=':userId'/>
                </Route>
                <Route path='/post/:postId' element={<Post />} />
                <Route path='/myschool' element={<MySchool />}/>
                <Route path='/new-post' element={<NewPost />} />
                <Route path='/' element={<Stream />} />
              </Routes>
            }
          </div>
        </Content>
        <AppFooter />
    </Layout>
  );
}

const AppContainer = () => {
  return (
    <HashRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </HashRouter>
  )
}

export default AppContainer;
