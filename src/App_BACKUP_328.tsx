<<<<<<< HEAD
import React, { useContext, useEffect, useState } from 'react';
//import './nullstyle.scss';
import './App.less';

import AppHeader from './components/Header';
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';

import { UserType } from './utils/types';

import { Provider, useSelector } from 'react-redux';

import Layout, { Content, Footer } from 'antd/lib/layout/layout';
=======
import { useContext, useEffect, useState } from 'react';
import './nullstyle.scss';
import "antd/dist/antd.css";
import './App.css';

import AppHeader from './components/Header';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';


import { Provider, useSelector } from 'react-redux';


import Layout, { Content } from 'antd/lib/layout/layout';
>>>>>>> 69a286cf7cc6ce1e9029c34159ab8e02d20ed641
import { store, useAppDispatch } from './Redux/store';
import Account from './components/Account';
import { networkErrorStatusChanged } from './Redux/app/appReducer';
import { loginDataReceived, setMyAccount } from './Redux/account/account-reducer';
<<<<<<< HEAD
import { selectMyLoginData } from './Redux/account/account-selectors';
=======
>>>>>>> 69a286cf7cc6ce1e9029c34159ab8e02d20ed641
import Preloader from './UI/Preloader';
import { FirebaseContext } from '.';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Auth } from 'firebase/auth';
import MySchool from './components/MySchool';
<<<<<<< HEAD
import Sider from 'antd/lib/layout/Sider';
=======
>>>>>>> 69a286cf7cc6ce1e9029c34159ab8e02d20ed641
import { Sidebar } from './components/Sidebar';
import { selectNetworkError } from './Redux/app/appSelectors';
import { NetworkError } from './UI/NetworkError';


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

  //get login data 
  useEffect(() => {
    const getLoginData = async () => {
      if(user) {
        await dispatch(loginDataReceived({...user}));
        await dispatch(setMyAccount(user));	
        setIsFetching(false);
      }
    }
    getLoginData();
    
  }, [user]);

  return (
    <Layout>
      <Sidebar />
      <Layout>
        <AppHeader />
<<<<<<< HEAD
        <Content className='Content'>
=======
        <Content className='Content' style={{paddingTop: '55px'}}>
>>>>>>> 69a286cf7cc6ce1e9029c34159ab8e02d20ed641
          <div className="site-layout-content" style={{flex: '1 1 auto'}}>
            {networkError && <NetworkError message={networkError} />}
            {isFetching || loading ? <Preloader /> :
              <Routes>
                <Route path='/login' element={<Login />}/>
                <Route path='/chat' element={<Chat />}/>
                <Route path='/account' element={<Account />}>
                  <Route path=':userId'/>
                </Route>
                <Route path='/myschool' element={<MySchool />}/>
              </Routes>
            }
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  );
}

const AppContainer = () => {
  return (
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  )
}

export default AppContainer;
