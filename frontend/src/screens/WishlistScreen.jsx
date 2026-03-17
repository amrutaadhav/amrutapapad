import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const WishlistScreen = () => {
  const { t } = useTranslation();
  const [wishlist, setLocalWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const userInfo = useStore((state) => state.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/users/wishlist', config);
        setLocalWishlist(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userInfo, navigate]);

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-primary">{t('Your Wishlist ❤️')}</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : wishlist.length === 0 ? (
        <Message>
          {t('Your wishlist is empty.')} <a href="/">{t('Go back to shop.')}</a>
        </Message>
      ) : (
        <Row>
          {wishlist.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={4}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default WishlistScreen;
