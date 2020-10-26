import { useState, useCallback, useRef, useEffect } from 'react'

// hook helperclass
export const useHttpClient = () =>  {
  // hooks
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  // useRef holds data also after re-initialisation or re-renderin the componente
  const activeHttpRequests = useRef([])

  // request with default values, wrapped in useCallback hook
  const sendRequest = useCallback( async (url, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true)
    // store AbortController in useRef for: 
    // signal: 
    const httpAbortCtrl = new AbortController()
    activeHttpRequests.current.push(httpAbortCtrl)
    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortCtrl.signal
      })
      
      const responseData = await response.json()
      // handle the not-200-ish errors here
      if(!response.ok) {
        throw new Error(responseData.message)
      }
      // status 200 return data
      return responseData

    // handle errors  of fetch / api
    } catch (err) {
      setError(err.message)
    }
    setIsLoading(false)
  }, [])
 

  const clearError = () => {
    setError(null)
  }
 
  // this prevents a http request to continue when we leave the component 
  // only runs on component mount, return-function is executed as a (empty) cleanup method
  // here: we have a look if there are abortControllers to have a abort. 
  
  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort())
    }
  }, [])

  // return the obj with all info
  return { isLoading, error, sendRequest, clearError }
  }
}