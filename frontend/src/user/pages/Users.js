import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'


const Users = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const [loadedUsers, setLoadedUsers] = useState()

  // load only once: -> useEffect Hook here with an empty []:
  useEffect(()=> {
    // create iffee: useEffect dont like async/ await functions: 
    // therfore create an iffee (here: sendRequst)
    // and do the async in there 
    const sendRequest = async () => {
      setIsLoading(true)
      try {
        // get the data in a responseData
        const response = await fetch('http://localhost:5000/api/users')
        const responseData = await response.json()


        // custom error if not 200ish
        if (!response.ok) {
          throw new Error(responseData.message)
        }

        setLoadedUsers(responseData.users)
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
      }
      setIsLoading(false)
    }
    sendRequest()
    // end of useEffect
  }, [])
  
  const errorHandler = () => {
    setError(null)
  }
 

  return (
    <>
    {/* <ErrorModal error={error} onClear={errorHandler} /> */}
    {isLoading && (
      <div className='center'>
        <LoadingSpinner />
      </div>
    )}
    {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  )
  
};

export default Users;
