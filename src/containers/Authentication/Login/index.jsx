import React from 'react';
import { Form, Input, Button, Card, Typography, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './Login.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../../services/watch.service';
import { useDispatch } from 'react-redux';
import { setAccessToken, setIsAdmin, setIsLoggedIn, setUsername } from '../../../features/authentication';

const { Title } = Typography;

const Login = ({ isModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()
  const onFinish = async (formData) => {
    try {
      // Unwrap the payload returned by the login mutation
      const payload = await login(formData).unwrap();
  
      // Dispatch actions with correct data from the payload
      dispatch(setIsAdmin(payload.isAdmin)); // Assuming payload contains isAdmin
      dispatch(setIsLoggedIn(true));
      dispatch(setUsername(payload.username));
  
      // Dispatch the access token
      dispatch(setAccessToken(payload.token)); // Make sure the token is correctly accessed from payload
  
      // Show a success message and navigate to the home page
      message.success(`Login Successfully, Welcome ${payload.username}`);
      
      if (!isModal) {
        navigate('/');
      }
    } catch (err) {
      message.error(`${err?.data?.message}`);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div className={styles.loginContainer}>
        <div className={styles.loginOverlay}>
          <Card className={styles.loginCard} hoverable>
            <Title level={2} className={styles.loginTitle}>Login</Title>
            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              className={styles.loginForm}
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
  
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block className={styles.loginButton}>
                  Log In
                </Button>
              </Form.Item>
            </Form>
            <div className={styles.extraLinks}>
              {/* <Link to="#">Forgot password?</Link> */}
              <Typography>Dont have account ? </Typography>
              <Link to="/register">Register now</Link>
            </div>
          </Card>
        </div>
      </div>
    </Spin>
  );
};

export default Login;
