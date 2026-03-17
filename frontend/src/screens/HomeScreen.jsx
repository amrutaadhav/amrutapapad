import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [offerText, setOfferText] = useState('');
  const [offerIsActive, setOfferIsActive] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products${keyword ? `?keyword=${keyword}` : ''}`);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        if (data) {
          setOfferText(data.offerText);
          setOfferIsActive(data.offerIsActive);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };

    fetchProducts();
    fetchSettings();
  }, [keyword]);

  return (
    <>
      {!keyword ? (
        <>
          <div className="hero-banner mb-5">
            <Container>
              <h1>{t('Welcome To Amruta Papad')}</h1>
              <p>{t('Authentic Maharashtrian Taste')}</p>
            </Container>
          </div>
          {offerIsActive && offerText && (
            <Container className="mb-4">
              <Alert variant="warning" className="text-center shadow-sm" style={{ borderLeft: '5px solid #e67e22', backgroundColor: '#fff3cd', color: '#856404' }}>
                🎇 <strong>{t('Festival Offer!')}</strong> {t(offerText)}
              </Alert>
            </Container>
          )}
        </>
      ) : (
        <Container className="mt-4">
          <Link to="/" className="btn btn-light mb-4">{t('Go Back')}</Link>
        </Container>
      )}

      <Container>
        <h2 className="mb-4 text-center">{keyword ? `${t('Search Results for')} "${keyword}"` : t('Popular Papads')}</h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={4}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
