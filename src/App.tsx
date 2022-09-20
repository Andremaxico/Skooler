import React, { useContext, useEffect, useState } from 'react';
//import './nullstyle.scss';
import './App.less';

import AppHeader from './components/Header';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';

import { UserType } from './utils/types';

import { Provider } from 'react-redux';

import { Content, Footer } from 'antd/lib/layout/layout';
import { store, useAppDispatch } from './Redux/store';
import Account from './components/Account';
import { networkErrorStatusChanged } from './Redux/app/appReducer';


const App = () => {
  const dispatch = useAppDispatch();


  useEffect(() => {
    const offlineHandler = () => {
      dispatch(networkErrorStatusChanged(`Перевірте з'єднання з мережею`));
      console.log('browser is offline');
    }
    const onlineHandler = () => {
      dispatch(networkErrorStatusChanged(null));
      console.log('browser is online');
    }

    window.addEventListener('offline', offlineHandler);
    window.addEventListener('online', onlineHandler);

    return () => {
      window.removeEventListener('offline', offlineHandler);
      window.removeEventListener('online', onlineHandler);
    }
  }, []);

  return (
    <>
      <AppHeader />
      <Content className='Content'>
        <div className="site-layout-content" style={{flex: '1 1 auto'}}>
          <Routes>
            <Route path='/login' element={<Login />}/>
            <Route path='/chat' element={<Chat />}/>
            <Route path='/account' element={<Account />} />
          </Routes>
        </div>
      </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </>
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
