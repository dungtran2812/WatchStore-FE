import React, { useState } from 'react';
import { Row, Col, Card, Descriptions, Spin, Alert, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import styles from './WatchDetails.module.scss';
import { useGetWatchByIdQuery } from '../../services/watch.service';
import CommentSection from '../CommentSection'; // Import your comment section

const { Title, Text } = Typography;

const WatchDetail = () => {
  const { id } = useParams();
  const { data: watch, error, isLoading } = useGetWatchByIdQuery(id);
  console.log(watch);

  if (isLoading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load watch details." type="error" showIcon />;
  }

  if (!watch) {
    return <Alert message="No Watch Found" description="The watch you are looking for does not exist." type="warning" showIcon />;
  }

  const { watchName, image, price, Automatic, watchDescription, comments } = watch;

  return (
    <div className={styles.watchDetailContainer}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            hoverable
            cover={<img alt={watchName} src={image} className={styles.watchImage} />}
          >
            <div className={styles.watchInfo}>
              <Title level={3} className={styles.watchName}>{watchName}</Title>
              <Text className={styles.brandName}>Brand: {watch?.brand?.brandName}</Text>
              <Descriptions layout="vertical" bordered className={styles.descriptions}>
                <Descriptions.Item label="Price" span={1} className={styles.price}>
                  <Text className={styles.priceValue}>${price}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Automatic" span={2} className={styles.automatic}>
                  <Text>{Automatic ? 'Yes' : 'No'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={3}>
                  {watchDescription}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <CommentSection comments={comments} watchId={id}/> {/* Add Comment Section */}
        </Col>
      </Row>

    </div>
  );
};

export default WatchDetail;
