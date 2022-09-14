import React, { useContext, useState } from 'react';
//import './nullstyle.scss';
import './App.less';

import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';

import { UserType } from './utils/types';

import { Provider } from 'react-redux';

import { Content, Footer } from 'antd/lib/layout/layout';
import { store } from './Redux/store';
import Account from './components/Account';


const App = () => {
  const [accountData, setAccountData] = useState<null | UserType>(null);
  // const routesData = [
  //   {
  //     element: <Chat />, to: '/chat'
  //   },
  //   {
  //     element: <Login />, to: '/login'
  //   }
  // ];

  // const routesList = routesData.map((data, i) => {
  //   return <Route element={data.element} to='/chat'/>
  // });

  return (
    <>
      <Header accountData={accountData}/>
      <Content style={{ padding: '0 50px', flex: '1 1 auto', display: 'flex' }}>
        <div className="site-layout-content" style={{flex: '1 1 auto'}}>
          <Routes>
            <Route path='/login' element={<Login setAccountData={setAccountData} />}/>
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
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  )
}

export default AppContainer;
