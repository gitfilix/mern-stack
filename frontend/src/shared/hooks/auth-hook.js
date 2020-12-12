import { useState, useCallback, useEffect } from 'react'


// 'behind the scenes -variable' logoutTimer
let logoutTimer

export const useAuth = () => {

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
    if (token && tokenExpirationDate) {
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
      new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  }, [login])

  // return token data, userId login and logout state
  return { token, login, logout, userId }
}