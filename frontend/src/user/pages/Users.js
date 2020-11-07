import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'

const Users = () => {
  // hook helper httpClient
  const {isLoading, error, sendRequest, clearError} = useHttpClient()
  const [loadedUsers, setLoadedUsers] = useState()

  // load only once: -> useEffect Hook here with an empty []:
  useEffect(()=> {
    // create iffee: useEffect dont like async/ await functions: 
    // therfore create an iffee (here: sendRequst)
    // and do the async in there 
    const fetchUsers = async () => {
      // setIsLoading(true)
      try {
        // get the data in a responseData
        const responseData = await sendRequest('http://localhost:5000/api/users')

        setLoadedUsers(responseData.users)
        // if error empty obj
      } catch (err) {}
    }
    fetchUsers()
    // end of useEffect
  }, [sendRequest])
  

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
