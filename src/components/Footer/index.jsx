import React from 'react';
import { Row, Col } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Row justify="space-between" align="middle" className={styles.row}>
        <Col xs={24} sm={12} md={8}>
          <div className={styles.footertext}>
            &copy; {new Date().getFullYear()} Watch Store. All rights reserved.
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className={styles.socials}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookOutlined />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <TwitterOutlined />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramOutlined />
            </a>
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
