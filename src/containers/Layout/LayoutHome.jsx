import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

const LayoutHome = () => {
  return (
    <>
      <Layout>
        <Header />
        <Content style={{ padding: '20px' }}>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default LayoutHome;
