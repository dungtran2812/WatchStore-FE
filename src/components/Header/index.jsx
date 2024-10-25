import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import styles from './Header.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { signout } from '../../features/authentication';
import { jwtDecode } from 'jwt-decode';


const Header = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state?.rootReducer?.user?.accessToken);
  const username = useSelector((state) => state?.rootReducer?.user?.username);

  // Decode the access token to get user data
  let isAdmin = false;
  if (accessToken) {
    const decodedToken = jwtDecode(accessToken); // Decode the token
    isAdmin = decodedToken.isAdmin; // Get isAdmin from the decoded token
  }

  const handleSignOut = () => {
    dispatch(signout()); // Dispatch logout action to clear user state
  };

  return (
    <header className={styles.header}>
      <Row justify="space-between" align="middle" className={styles.row}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <div className={styles.logoContainer}>
            <Link to="/">
              <img src="https://img.freepik.com/premium-vector/luxury-watch-brand-logo_628554-9.jpg" alt="Watch Store Logo" className={styles.logo} />
            </Link>
          </div>
        </Col>
        <Col xs={24} sm={12} md={16} lg={18}>
          <nav className={styles.nav}>
            <Row justify="end" gutter={[16, 16]}>
              <Col>
                <Link to="/">Home</Link>
              </Col>

              {accessToken ? (
                <>
                  {isAdmin && ( // Conditionally render the Dashboard link
                    <Col>
                      <Link to="/dashboard">Dashboard</Link>
                      <Link to="/brandmng">Brand Manage</Link>
                      <Link to="/usermng">User Manage</Link>
                    </Col>
                  )}
                  <Col>
                    <Link to="/profile">Profile</Link>
                  </Col>
                  <Col>
                    <span>Welcome, {username}</span> {/* Show username when logged in */}
                  </Col>
                  <Col>
                    <Button onClick={handleSignOut}>Sign Out</Button> {/* Sign out button */}
                  </Col>
                </>
              ) : (
                <Col>
                  <Link to="/login">Login</Link>
                </Col>
              )}
            </Row>
          </nav>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
