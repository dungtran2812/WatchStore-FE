import React, { useState } from 'react';
import { Table, Button, Modal, message, Select, Input, Radio } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './Dashboard.module.scss';
import { useCreateWatchMutation, useDeleteWatchMutation, useGetBrandQuery, useGetWatchQuery, useUpdateWatchMutation } from '../../services/watch.service';

const { Option } = Select;

const Dashboard = () => {
  const { data: brands = [] } = useGetBrandQuery(); // Fetch brands
  const { data: watches = [], refetch } = useGetWatchQuery();
  const [createWatch] = useCreateWatchMutation();
  const [updateWatch] = useUpdateWatchMutation();
  const [deleteWatch] = useDeleteWatchMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWatch, setEditingWatch] = useState(null);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    watchName: Yup.string().required('Watch Name is required'),
    image: Yup.string().required('Image URL is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    Automatic: Yup.boolean().required('Automatic selection is required'),
    watchDescription: Yup.string().required('Watch Description is required'),
    brand: Yup.string().required('Brand selection is required'),
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      watchName: '',
      image: '',
      price: '',
      Automatic: false,
      watchDescription: '',
      brand: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingWatch) {
          // Update watch
          await updateWatch({ id: editingWatch._id, updatedWatch: {...values} }).unwrap();
          message.success('Watch updated successfully');
        } else {
          // Create new watch
          await createWatch(values).unwrap();
          message.success('Watch added successfully');
        }
        refetch();
        setIsModalVisible(false);
        formik.resetForm();
      } catch (err) {
        message.error(err?.data?.message || "Operation failed");
      }
    },
  });

  const handleAdd = () => {
    formik.resetForm();
    setEditingWatch(null);
    setIsModalVisible(true);
  };

  const handleEdit = (watch) => {
    formik.setValues({
      watchName: watch.watchName,
      image: watch.image,
      price: watch.price,
      Automatic: watch.Automatic,
      watchDescription: watch.watchDescription,
      brand: watch.brand._id,
    });
    setEditingWatch(watch);
    setIsModalVisible(true);
  };

  const handleDelete = (watch) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this watch?',
      onOk: async () => {
        await deleteWatch(watch._id)
          .unwrap()
          .then(() => {
            message.success('Watch deleted successfully');
            refetch();
          })
          .catch((err) => {
            message.error(err?.data?.message);
          });
      },
    });
  };

  // Updated columns to include `brandName` and display watch image
  const columns = [
    {
      title: 'Watch Name',
      dataIndex: 'watchName',
      key: 'watchName',
    },
    {
      title: 'Brand Name', // Show brandName
      dataIndex: ['brand', 'brandName'],
      key: 'brandName',
      render: (_, record) => record.brand?.brandName || 'No brand', // Fallback if no brand is associated
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Automatic',
      dataIndex: 'Automatic',
      key: 'Automatic',
      render: (value) => (value ? 'Yes' : 'No'), // Convert boolean to string
    },
    {
      title: 'Watch Image', // Added field to display watch image
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="Watch" style={{ width: '100px', height: 'auto' }} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, watch) => (
        <span>
          <Button onClick={() => handleEdit(watch)} type="link">Edit</Button>
          <Button onClick={() => handleDelete(watch)} type="link" danger>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Watch Management</h2>
      <Button type="primary" onClick={handleAdd} className={styles.addButton}>Add Watch</Button>
      <Table columns={columns} dataSource={watches} rowKey="_id" />

      <Modal
        title={editingWatch ? 'Edit Watch' : 'Add New Watch'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={formik.handleSubmit}
      >
        <form onSubmit={formik.handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label>Watch Name</label>
            <Input
              name="watchName"
              placeholder="Enter watch name"
              value={formik.values.watchName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ width: '100%' }} // Set width to 100%
            />
            {formik.touched.watchName && formik.errors.watchName ? (
              <div className={styles.error}>{formik.errors.watchName}</div>
            ) : null}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Image URL</label>
            <Input
              name="image"
              placeholder="Enter image URL"
              value={formik.values.image}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ width: '100%' }} // Set width to 100%
            />
            {formik.touched.image && formik.errors.image ? (
              <div className={styles.error}>{formik.errors.image}</div>
            ) : null}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Price</label>
            <Input
              name="price"
              placeholder="Enter price"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ width: '100%' }} // Set width to 100%
            />
            {formik.touched.price && formik.errors.price ? (
              <div className={styles.error}>{formik.errors.price}</div>
            ) : null}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Automatic</label>
            <Radio.Group
              name="Automatic"
              value={formik.values.Automatic}
              onChange={(e) => formik.setFieldValue('Automatic', e.target.value)}
              style={{ width: '100%' }} // Set width to 100%
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
            {formik.touched.Automatic && formik.errors.Automatic ? (
              <div className={styles.error}>{formik.errors.Automatic}</div>
            ) : null}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Watch Description</label>
            <Input.TextArea
              name="watchDescription"
              placeholder="Enter watch description"
              value={formik.values.watchDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{ width: '100%' }} // Set width to 100%
            />
            {formik.touched.watchDescription && formik.errors.watchDescription ? (
              <div className={styles.error}>{formik.errors.watchDescription}</div>
            ) : null}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Brand</label>
            <Select
              name="brand"
              value={formik.values.brand}
              onChange={(value) => formik.setFieldValue('brand', value)}
              style={{ width: '100%' }} // Set width to 100%
            >
              {brands.map((brand) => (
                <Option key={brand._id} value={brand._id}>
                  {brand.brandName}
                </Option>
              ))}
            </Select>
            {formik.touched.brand && formik.errors.brand ? (
              <div className={styles.error}>{formik.errors.brand}</div>
            ) : null}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
