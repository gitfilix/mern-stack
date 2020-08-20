// USER - P A G E - from the pages directory
import React from 'react'
import UsersList from '../components/UsersList'


const Users = () => {
  // dummy placehoder const
  const USERS = [
    {
      id: 'u1',
      name: 'filikowski',
      image: 'https://static.tvtropes.org/pmwiki/pub/images/a3ae1935dee0f88f0681f8246e985fc7.jpg',
      places: 5
    }
  ]
  return <UsersList items={USERS} />
}

export default Users