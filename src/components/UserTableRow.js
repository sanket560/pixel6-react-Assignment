import React from 'react';

const UserTableRow = ({ user }) => {
  return (
    <tr>
      <td>{user.id}</td>
      <td><img src={user.image} alt={user.fullName} className="user-image" /></td>
      <td>{user.firstName} {user.lastName}</td>
      <td>{user.gender}/{user.age}</td>
      <td>{user.company.title}</td>
      <td>{user.address.city}, {user.address.state}, {user.address.country}</td>
    </tr>
  );
};

export default UserTableRow;
