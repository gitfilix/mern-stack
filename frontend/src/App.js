import React, {useState, useCallback, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context'

// 'behind the scenes -variable' logoutTimer
let logoutTimer

const App = () => {
  const [token, setToken] = useState(false)
  const [tokenExpirationDate, setTokenExpirationDate] = useState()
  const [userId, setUserId] = useState(false)
 
  // run that only on initial load dep-arry: []
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token)
    setUserId(uid)
    // remainingExpirationTimeString + now + 1h or valid expiration date from props
    const remainingExpirationTimeString = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    
    setTokenExpirationDate(tokenExpirationDate)
    // localstorage set uid and token
    localStorage.setItem('userData', JSON.stringify({
        userId: uid,
        token: token,
        expiration: remainingExpirationTimeString.toISOString()
      })
    )
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenExpirationDate(null)
    setUserId(null)
    localStorage.removeItem('userData')
  }, [])

  // logout timer hook 
  useEffect(() => {
    if (token && tokenExpirationDate ) {
      // check if tokenExpirationDate is still valid 
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      // again behind the scene variable logoutTimer
      logoutTimer = setTimeout(logout, remainingTime)
      console.log('logoutTimer', logoutTimer)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpirationDate])

  // useEffect runs always After (the first) render-cycle
  // if stored.data for user id -> execute login function
  useEffect(() => {
    // read the localstorage
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration)> new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  }, [login])

  // routes for logged-in or not
  let routes
  if (token) {
    routes = (
      // loged in (private)
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  } else {
    // not logged in (public)
    routes = (
       <Switch >
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    )
  }

  return (
    <AuthContext.Provider 
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }} 
    >
      <Router>
        <MainNavigation />
        <main>
            {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;