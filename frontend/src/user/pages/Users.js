import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'FiLiX Admski',
      image: 'https://static.tvtropes.org/pmwiki/pub/images/a3ae1935dee0f88f0681f8246e985fc7.jpg',
      places: 5
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
