import React from 'react';
import { Spin, Table } from 'antd';
import { useGetAllUserProfileQuery, useGetUserProfileQuery } from '../../services/watch.service';

const UserMng = () => {
  // Fetch the current user's profile
  const { data: currentUser, isLoading: isCurrentUserLoading } = useGetUserProfileQuery();
  
  // Fetch all user profiles
  const { data: users, isLoading: isAllUsersLoading } = useGetAllUserProfileQuery();
  
  // Ensure both queries are loaded before proceeding
  const isLoading = isCurrentUserLoading || isAllUsersLoading;

  // Filter out the currently logged-in user
  const filteredUsers = users?.filter(user => user._id !== currentUser?._id);

  // Define the columns for the Ant Design Table
  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (name ? name : 'Not updated yet'), // Fallback for missing name
    },
    {
      title: 'Year of Birth',
      dataIndex: 'YOB',
      key: 'YOB',
      render: (YOB) => (YOB ? YOB : 'Not updated yet'), // Fallback for missing YOB
    },
    {
      title: 'Is Admin',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin) => (isAdmin ? 'Yes' : 'No'),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return <Spin tip="Loading users..." />;
  }

  return (
    <div>
      <h1>User Management</h1>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserMng;
