import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useUpdatePasswordMutation } from '../../../services/watch.service';
import styles from '../UpdatePassword/UpdatePassword.module.scss'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../../features/authentication';

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [updatePassword] = useUpdatePasswordMutation(); // Destructure the mutation function
  const dispatch = useDispatch()
  // Handle form submission
  const onFinish = async (values) => {
    
    const { newPassword, currentPassword } = values
    setLoading(true);
    try {
      // Call the mutation to update the password
      const result = await updatePassword({newPassword: newPassword, currentPassword: currentPassword}).unwrap();
      console.log(result)
      dispatch(setAccessToken(result.token))
      message.success('Password updated successfully');
    } catch (error) {
      message.error(error?.data?.message || 'Failed to update password');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Update Password</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: 'Please input your current password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: 'Please input your new password!' },
            { min: 3, message: 'Password must be at least 6 characters' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('currentPassword') !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The new password must be different with current password!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmNewPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Update Password
        </Button>
      </Form>
      <Button type="primary" className={styles.passbtn}>
        <Link to="/profile">Edit Profile</Link>
      </Button>
    </div>
  );
};

export default UpdatePassword;
