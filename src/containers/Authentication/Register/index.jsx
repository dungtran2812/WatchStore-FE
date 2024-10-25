import React from 'react';
import { Form, Input, Button, Card, Typography, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';
import { useRegisterMutation } from '../../../services/watch.service';

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate()
  const [register, {isLoading}] = useRegisterMutation()
  const onFinish = (values) => {
    const { username, password } = values;
    register({username: username, password: password}).unwrap()
      .then(() => {
        message.success('Register successfully')
        navigate('/login')
      })
      .catch((err) => {
        message.error(`${err.data.message}`)
      })
    console.log('Received values: ', values);
  };

  return (
    <Spin spinning={isLoading}>
      <div className={styles.registerContainer}>
        <div className={styles.registerOverlay}>
          <Card className={styles.registerCard} hoverable>
            <Title level={2} className={styles.registerTitle}>Register</Title>
            <Form
              name="register"
              onFinish={onFinish}
              layout="vertical"
              className={styles.registerForm}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input
                  prefix={<UserOutlined className={styles.icon} />}
                  placeholder="Username"
                  size="large"
                  className={styles.inputField}
                />
              </Form.Item>
  
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.icon} />}
                  placeholder="Password"
                  size="large"
                  className={styles.inputField}
                />
              </Form.Item>
  
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.icon} />}
                  placeholder="Confirm Password"
                  size="large"
                  className={styles.inputField}
                />
              </Form.Item>
  
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block className={styles.registerButton}>
                  Register
                </Button>
              </Form.Item>
            </Form>
  
            <div className={styles.extraLinks}>
              <span>Already have an account? <Link to="/login">Log In</Link></span>
            </div>
          </Card>
        </div>
      </div>
    </Spin>
  );
};

export default Register;
