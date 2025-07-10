import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/admin/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => setUsers(res.data));
  }, []);

  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">ID</th>
          <th className="p-2">Username</th>
          <th className="p-2">Email</th>
          <th className="p-2">Is Admin</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u: any) => (
          <tr key={u.id}>
            <td className="p-2">{u.id}</td>
            <td className="p-2">{u.username}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">{u.is_admin ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
