import React, { useEffect, useState } from 'react';
import { Form, Input, Button, List, Typography, Rate, message, Spin, Modal, Progress } from 'antd';
import styles from './CommentSection.module.scss';
import { usePostCommentMutation } from '../../services/watch.service';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import Login from '../Authentication/Login'; // Assuming you have a LoginForm component for the modal

const { Title, Text } = Typography;

const CommentSection = ({ comments: initialComments, watchId }) => {
  const [userData, setUserData] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0); // State for rating
  const [comments, setComments] = useState(initialComments); // State for comments
  const [hasCommented, setHasCommented] = useState(false); // State to track if user has commented
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control login modal visibility
  const [postComment, { isLoading }] = usePostCommentMutation();
  const accessToken = useSelector(state => state?.rootReducer?.user?.accessToken);

  const handleCommentChange = (e) => {
    setContent(e.target.value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  // Calculate the average rating and number of ratings breakdown
  const calculateRatingStats = (comments) => {
    const totalComments = comments.length;
    const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
    const averageRating = (totalRating / totalComments).toFixed(1);

    const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: comments.filter(comment => comment.rating === star).length,
    }));

    return { totalComments, averageRating, ratingBreakdown };
  };

  const { totalComments, averageRating, ratingBreakdown } = calculateRatingStats(comments);

  useEffect(() => {
    if (accessToken) {
      const decodedUserData = jwtDecode(accessToken);
      setUserData(decodedUserData);

      // Check if the user has already commented
      const userHasCommented = comments.some(comment => comment.author._id === decodedUserData.userId);
      setHasCommented(userHasCommented);
    }
  }, [accessToken, comments]);

  const handleSubmit = () => {
    if (content.trim() && rating > 0) {
      const newComment = {
        rating: rating,
        content: content,
        author: { _id: userData.userId, username: userData.username },
        createdAt: new Date().toISOString(), // Temporarily setting the date
      };

      postComment({ commentData: { rating, content, author: userData.userId }, id: watchId })
        .unwrap()
        .then(() => {
          message.success('Comment Successfully');
          // Add the new comment to the state
          setComments([newComment, ...comments]); // Update the comments array
          setContent(''); // Clear input
          setRating(0); // Reset rating
          setHasCommented(true); // Hide the form since user has now commented
        })
        .catch((err) => {
          message.error(err?.data?.message);
        });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <Spin spinning={isLoading}>
      <div className={styles.commentSection}>
        <Title level={4}>Comments ({totalComments})</Title>

        {/* Rating analysis section */}
        <div className={styles.ratingAnalysis}>
          <div className={styles.averageRating}>
            {console.log(averageRating)}
            <Title level={2}>{averageRating !== 'NaN' ? averageRating : 'No Comment for this watch'}</Title>
            <Rate disabled value={parseFloat(averageRating)} />
            <Text>{totalComments} reviews</Text>
          </div>

          <div className={styles.ratingBreakdown}>
            {ratingBreakdown.map(({ star, count }) => (
              <div key={star} className={styles.ratingRow}>
                <Text>{star} stars / {count} User</Text>
                <Progress
                  percent={(count / totalComments) * 100}
                  showInfo={false}
                  className={styles.progressBar}
                />
                <Text></Text>
              </div>
            ))}
          </div>
        </div>

        {/* List of comments */}
        <List
          bordered
          dataSource={comments}
          renderItem={(item) => (
            <List.Item>
              <div className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <Rate disabled value={item?.rating} />
                  <Typography.Text strong className={styles.commentAuthor}>
                    {item?.author?.username}
                  </Typography.Text>
                  <Typography.Text className={styles.commentDate}>
                    Posted on: {new Date(item?.createdAt).toLocaleString()} {/* Format date */}
                  </Typography.Text>
                </div>
                <Typography.Text className={styles.commentContent}>
                  {item?.content}
                </Typography.Text>
              </div>
            </List.Item>
          )}
        />

        {/* If user is not logged in, show login button */}
        {!accessToken ? (
          <div className={styles.alertMessage}>
            <Text type="warning">Please log in to add a comment.</Text>
            <Button type="primary" onClick={showModal}>Login</Button> {/* Trigger modal */}
          </div>
        ) : (
          !hasCommented ? (
            <Form className={styles.form} layout="inline" onFinish={handleSubmit}>
              <Form.Item>
                <Rate onChange={handleRatingChange} value={rating} />
              </Form.Item>
              <Form.Item>
                <Input
                  value={content}
                  onChange={handleCommentChange}
                  placeholder="Add a comment..."
                  style={{ width: '300px' }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          ) : "You have comment this watch"
        )}

        {/* Modal for login */}
        {!accessToken && <Modal
          title="Login"
          visible={isModalVisible}
          onCancel={handleModalCancel}
          footer={null} // No footer buttons
        >
          <Login isModal={true}/>
        </Modal>}
      </div>
    </Spin>
  );
};

export default CommentSection;
