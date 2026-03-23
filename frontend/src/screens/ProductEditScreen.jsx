import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';

const ProductEditScreen = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userInfo = useStore((state) => state.userInfo);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setOriginalPrice(data.originalPrice || 0);
        setImage(data.image);
        setImages(data.images || []);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `/api/products/${id}`,
        { name, price, originalPrice, image, images, category, countInStock, description },
        config
      );
      setLoading(false);
      navigate('/admin/productlist');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <Container className="py-3">
      <Link to="/admin/productlist" className="btn btn-light my-3">
        {t('Go Back')}
      </Link>
      <h2>{t('Edit Product')}</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler} className="bg-white p-4 rounded shadow-sm">
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>{t('Name')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('Enter name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="price" className="mb-3">
            <Form.Label>{t('Price (₹)')}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t('Enter price')}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="originalPrice" className="mb-3">
            <Form.Label>{t('Original Price (₹)')}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t('Enter original price (e.g. higher price for strike-through)')}
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="image" className="mb-3">
            <Form.Label>{t('Primary Image URL')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('Enter image url')}
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="image-file" className="mb-3">
            <Form.Label>{t('Upload Additional Photos')}</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={async (e) => {
                const files = e.target.files;
                const formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                  formData.append('images', files[i]);
                }
                
                setUploading(true);
                try {
                  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                  const { data } = await axios.post('/api/upload/multiple', formData, config);
                  setImages([...images, ...data]);
                  setUploading(false);
                } catch (error) {
                  console.error(error);
                  setUploading(false);
                }
              }}
            ></Form.Control>
            {uploading && <Loader />}
          </Form.Group>
          {images.length > 0 && (
            <div className="mb-3">
              <p>{t('Uploaded Photos:')}</p>
              <div className="d-flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img src={img} alt="Product" style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="rounded" />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="position-absolute top-0 end-0 m-1"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    >X</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Form.Group controlId="countInStock" className="mb-3">
            <Form.Label>{t('Count In Stock')}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t('Enter countInStock')}
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="category" className="mb-3">
            <Form.Label>{t('Category')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('Enter category')}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>{t('Description')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={t('Enter description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            {t('Update')}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default ProductEditScreen;
