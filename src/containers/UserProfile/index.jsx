import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { useGetUserProfileQuery, useUpdateProfileMutation } from '../../services/watch.service';
import { Link } from 'react-router-dom';
import styles from '../UserProfile/UserProfile.module.scss';

const UserProfile = () => {
  // Fetch the current user profile using RTK Query
  const { data: user, error, isLoading, refetch } = useGetUserProfileQuery();

  // Set up the mutation for updating the profile
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [form] = Form.useForm();

  // Pre-fill the form with user data when it is available
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.name || '', // Safeguard in case fields are undefined
        YOB: user?.YOB || '',
      });
    }
  }, [user, form]);

  // Handle form submission
  const onFinish = async (values) => {
    try {
      await updateProfile(values).unwrap()
        .then(() => {
          refetch()
        });
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  // Render spinner while loading profile data
  if (isLoading || isUpdating) return <Spin tip="Loading profile..." />;

  // Handle errors when fetching profile
  if (error) {
    return <div>Error loading profile</div>;
  }

  return (
    <div>
      <h1>Edit Profile</h1>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ name: '', YOB: '' }} // Default initial values
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Year of Birth"
          name="YOB"
          rules={[{ required: true, message: 'Please input your year of birth!' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Save Changes
        </Button>
      </Form>

      <Button type="primary" className={styles.passbtn}>
        <Link to="/updatepassword">Update Password</Link>
      </Button>
    </div>
  );
};

export default UserProfile;
