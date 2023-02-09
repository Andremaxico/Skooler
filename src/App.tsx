import React from 'react';
import { useContext, useEffect, useState } from 'react';
import './nullstyle.scss';
import "antd/dist/antd.css";
import classes from './App.module.scss';

import AppHeader from './components/Header';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';

import { Provider, useSelector } from 'react-redux';


import Layout, { Content, Footer } from 'antd/lib/layout/layout';
import { store, useAppDispatch } from './Redux/store';
import { networkErrorStatusChanged } from './Redux/app/appReducer';
import { loginDataReceived, setMyAccount } from './Redux/account/account-reducer';

import Preloader from './UI/Preloader';
import { FirebaseContext } from '.';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Auth, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import MySchool from './components/MySchool';

import { Sidebar } from './components/Sidebar';
import { selectFooterHeight, selectHeaderHeight, selectNetworkError } from './Redux/app/appSelectors';
import { NetworkError } from './UI/NetworkError';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { Registration } from './components/Registration';
import { createTheme, ThemeProvider } from '@mui/material';
import { AppFooter } from './components/AppFooter';
import Stream from './components/Stream';
import { NewPost } from './components/NewPost';
import { Post } from './components/Post';



import { deepmerge } from '@mui/utils';
import {
  useColorScheme,
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendMuiTheme,
} from '@mui/material/styles';
import { extendTheme as extendJoyTheme } from '@mui/joy/styles';
import { blue, grey } from '@mui/material/colors';
import withSuspense from './utils/hoc/withSuspense';
import { selectUserActionStatus } from './Redux/stream/stream-selectors';
import { ActionStatus } from './UI/ActionStatus';

const Chat = React.lazy(() => import('./components/Chat'));
const Login = React.lazy(() => import('./components/Login'))
const Account = React.lazy(() => import('./components/Account'));

const primaryCol = {
  50: '#d0d6c9',
  100: '#b0bba5',
  200: '#909f81',
  300: '#81916f',
  400: '#61764b',
  500: '#576a44',
  600: '#4e5e3c',
  700: '#445335',
}

console.log('blue color', blue);

//mui theme
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#61764B',
      dark: '#4e5e3c',
      light: '#81916f',
    },
    secondary: {
      main: '#9BA17B',
    },
    
  },
});

// Note: you can't put `joyTheme` inside Material UI's `extendMuiTheme(joyTheme)`
// because some of the values in the Joy UI theme refers to CSS variables and
// not raw colors.

//joyUI theme
const joyTheme = extendJoyTheme({
  // This is required to point to `var(--mui-*)` because we are using
  // `CssVarsProvider` from Material UI.
  cssVarPrefix: 'mui',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          ...primaryCol,
          solidColor: 'var(--mui-palette-primary-contrastText)',
          solidBg: 'var(--mui-palette-primary-main)',
          solidHoverBg: 'var(--mui-palette-primary-dark)',
          plainColor: 'var(--mui-palette-primary-main)',
          plainHoverBg:
            'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          plainActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
          outlinedBorder: 'rgba(var(--mui-palette-primary-mainChannel) / 0.5)',
          outlinedColor: 'var(--mui-palette-primary-main)',
          outlinedHoverBg:
            'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          outlinedHoverBorder: 'var(--mui-palette-primary-main)',
          outlinedActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
      
        },
        neutral: {
          ...grey,
        },
        // Do the same for the `danger`, `info`, `success`, and `warning` palettes,
        divider: 'var(--mui-palette-divider)',
        text: {
          tertiary: 'rgba(0 0 0 / 0.56)',
        },

      },
    },
    // Do the same for dark mode
    // dark: { ... }
  },
  fontFamily: {
    display: '"Roboto","Helvetica","Arial",sans-serif',
    body: '"Roboto","Helvetica","Arial",sans-serif',
  },
  shadow: {
    xs: `var(--mui-shadowRing), ${muiTheme.shadows[1]}`,
    sm: `var(--mui-shadowRing), ${muiTheme.shadows[2]}`,
    md: `var(--mui-shadowRing), ${muiTheme.shadows[4]}`,
    lg: `var(--mui-shadowRing), ${muiTheme.shadows[8]}`,
    xl: `var(--mui-shadowRing), ${muiTheme.shadows[12]}`,
  },
});

// You can use your own `deepmerge` function.
// muiTheme will deeply merge to joyTheme.
const theme = deepmerge(joyTheme, muiTheme);

const SuspensedChat = withSuspense(Chat);
const SuspensedLogin = withSuspense(Login);
const SuspensedAccount = withSuspense(Account);

const App = () => {
  const { auth } = useContext(FirebaseContext);
  const [ user, loading ] = useAuthState(auth as Auth);

  const [isFetching, setIsFetching] = useState<boolean>(loading);
  const networkError = useSelector(selectNetworkError);
  const userAction = useSelector(selectUserActionStatus);

  const dispatch = useAppDispatch();

  //internet check
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


  //footer&header height for padding botton
  const footerHeight = useSelector(selectFooterHeight);
  const headerHeight = useSelector(selectHeaderHeight);

  console.log('heights', footerHeight, headerHeight);

  if(loading) return <Preloader />
  //if(!loading && !user) return <Login />; 
  
  return (
    <Layout>
        <AppHeader />
        <Content 
          className={classes.Content} 
          style={{
            paddingTop: `${headerHeight}px`, 
            paddingBottom: `${footerHeight}px`,
          }}
        >
          <div className="site-layout-content" style={{flex: '1 1 auto'}}>
            {networkError && <NetworkError message={networkError || ''} />}
            {isFetching || loading ? <Preloader /> : !loading && !user ? <Login /> :
              <Routes>
                <Route path='/login' element={<SuspensedLogin />}/>
                <Route path='/chat' element={<SuspensedChat />}/>
                <Route path='/account' element={<SuspensedAccount />}>
                  <Route path=':userId'/>
                </Route>
                <Route path='/post/:postId' element={<Post />} />
                <Route path='/myschool' element={<MySchool />}/>
                <Route path='/new-post' element={<NewPost />} />
                <Route path='/' element={<Stream />} />
              </Routes>
            }
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
        </Content>
        <AppFooter />
    </Layout>
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
