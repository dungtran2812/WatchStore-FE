import React, { useState } from 'react';
import { Table, Button, Modal, message, Input } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './BrandMng.module.scss';
import { useCreateBrandMutation, useDeleteBrandMutation, useGetBrandQuery, useUpdateBrandMutation } from '../../services/watch.service';

const BrandMng = () => {
  const { data: brands = [], refetch } = useGetBrandQuery(); // Fetch brands
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    brandName: Yup.string().required('Brand Name is required'),
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      brandName: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (editingBrand) {
        // Update brand
        await updateBrand({ id: editingBrand._id, updatedBrand: { ...values } })
          .unwrap()
          .then(() => {
            message.success('Brand updated successfully');
            refetch();
            setIsModalVisible(false);
          })
          .catch((err) => {
            message.error(err?.data?.message);
          });
      } else {
        // Create new brand
        await createBrand(values)
          .unwrap()
          .then(() => {
            message.success('Brand added successfully');
            refetch();
            setIsModalVisible(false);
          })
          .catch((err) => {
            message.error(err?.data?.message);
          });
      }
    },
  });

  const handleAdd = () => {
    formik.resetForm();
    setEditingBrand(null);
    setIsModalVisible(true);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    formik.setFieldValue('brandName', brand.brandName);
    setIsModalVisible(true);
  };

  const handleDelete = (brand) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this brand?',
      onOk: async () => {
        await deleteBrand(brand._id)
          .unwrap()
          .then(() => {
            message.success('Brand deleted successfully');
            refetch();
          })
          .catch((err) => {
            message.error(err?.data?.message);
          });
      },
    });
  };

  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, brand) => (
        <span>
          <Button onClick={() => handleEdit(brand)} type="link">Edit</Button>
          <Button onClick={() => handleDelete(brand)} type="link" danger>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.brandDashboard}>
      <h2 className={styles.title}>Brand Management</h2>
      <Button type="primary" onClick={handleAdd} className={styles.addButton}>Add Brand</Button>
      <Table columns={columns} dataSource={brands} rowKey="_id" />

      <Modal
        title={editingBrand ? 'Edit Brand' : 'Add New Brand'}
        visible={isModalVisible}
        onOk={formik.handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.formItem}>
            <label>Brand Name</label>
            <Input
              name="brandName"
              placeholder="Enter brand name"
              value={formik.values.brandName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.brandName && formik.errors.brandName ? (
              <div className={styles.error}>{formik.errors.brandName}</div>
            ) : null}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BrandMng;
