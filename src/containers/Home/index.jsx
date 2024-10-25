import React, { useState } from 'react';
import { Row, Col, Card, Spin, Typography, Button, Select, Slider, Checkbox, Input } from 'antd';
import { Link } from 'react-router-dom'; // If using react-router for navigation
import { useGetWatchQuery } from '../../services/watch.service';
import styles from './Home.module.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const Home = () => {
  const { data, error, isLoading } = useGetWatchQuery('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for watch name search

  // Handle brand filter
  const handleBrandChange = (value) => {
    setSelectedBrand(value);
  };

  // Handle price range filter
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  // Handle automatic filter
  const handleAutomaticChange = (e) => {
    setIsAutomatic(e.target.checked);
  };

  // Handle search query input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter the watch data based on selected filters
  const filteredWatches = data?.filter((watch) => {
    const matchesBrand = selectedBrand ? watch.brand?.brandName === selectedBrand : true;
    const matchesPrice = watch.price >= priceRange[0] && watch.price <= priceRange[1];
    const matchesAutomatic = isAutomatic ? watch.Automatic === true : true;
    const matchesName = watch.watchName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesPrice && matchesAutomatic && matchesName;
  });

  const marks = {
    0: '0$',
    5000: '5000$',
    10000: '10000$'
  };

  return (
    <Spin spinning={isLoading}>
      {!error ? (
        <div className={styles.home}>
          <h1 className={styles.title}>Welcome to Our Watch Store</h1>

          {/* Filter Options */}
          <div className={styles.filters}>
            <Search
              placeholder="Search by name"
              onChange={handleSearchChange}
              style={{ width: 200, marginRight: 16 }}
            />

            <Select
              placeholder="Select Brand"
              onChange={handleBrandChange}
              style={{ width: 200 }}
            >
              <Option value="">All Brands</Option>
              {/* Add available brand options dynamically */}
              {data?.map((watch) => (
                <Option key={watch.brand?.brandName} value={watch.brand?.brandName}>
                  {watch.brand?.brandName}
                </Option>
              ))}
            </Select>

            <Slider
              marks={marks}
              range
              defaultValue={priceRange}
              min={0}
              max={10000}
              onChange={handlePriceChange}
              style={{ width: 300, marginLeft: 16 }}
            />

            <Checkbox
              onChange={handleAutomaticChange}
              style={{ marginLeft: 16 }}
            >
              Automatic
            </Checkbox>
          </div>

          {/* Display Watches */}
          <Row gutter={[16, 16]} className={styles.watchGrid}>
            {filteredWatches?.length > 0 ? (
              filteredWatches.map((watch) => (
                <Col xs={24} sm={12} md={8} lg={6} key={watch?._id}>
                  <Card
                    hoverable
                    cover={<img alt={watch?.watchName} src={watch?.image} className={styles.watchImage} />}
                    className={styles.watchCard}
                  >
                    <Title level={4}>{watch?.watchName}</Title>
                    <Text className={styles.priceText}>Price: ${watch?.price}</Text>
                    <br />
                    <Text className={styles.brandText}>Brand: {watch?.brand?.brandName}</Text>
                    <br />
                    <Text className={styles.automaticText}>Automatic: {watch?.Automatic ? 'Yes' : 'No'}</Text>
                    <br />
                    <Button type="primary" className={styles.viewDetailsButton}>
                      <Link to={`/watch/${watch?._id}`}>View Details</Link>
                    </Button>
                  </Card>
                </Col>
              ))
            ) : (
              <Text>No watches found matching the filters</Text>
            )}
          </Row>
        </div>
      ) : (
        'Failed to fetch data'
      )}
    </Spin>
  );
};

export default Home;
