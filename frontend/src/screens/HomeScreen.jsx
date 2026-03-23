import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Carousel } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [offerText, setOfferText] = useState('');
  const [offerIsActive, setOfferIsActive] = useState(false);

  const [sortOrder, setSortOrder] = useState('default');
  const location = useLocation();
  const [category, setCategory] = useState(location.state?.category || 'All');

  useEffect(() => {
    if (location.state?.category) {
      setCategory(location.state.category);
    }
  }, [location.state]);

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
          
          {/* New Cloudinary Sliding Image Gallery */}
          {(!loading || loading) && (
            <Container className="mb-5 mt-4 px-0 px-md-3">
              <h2 className="text-center mb-4" style={{ fontWeight: '700', color: 'var(--primary-color)' }}>
                {t('Our Gallery')}
              </h2>
              <div className="custom-gallery-container">
                <Carousel fade interval={2000} indicators={true} pause="hover">
                  {[
                    "https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286210/1_y8pfs5.jpg",
                    "https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286210/2_auxyyj.jpg",
                    "https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286222/3_afegrp.jpg",
                    "https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286220/4_ckrqkd.jpg",
                    "https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286223/5_vyj9x7.jpg",
                    "https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286208/6_ymx90e.jpg"
                  ].map((imageUrl, idx) => (
                    <Carousel.Item key={idx} className="custom-gallery-item">
                      <img
                        className="d-block custom-gallery-img"
                        src={imageUrl}
                        alt={`Gallery Image ${idx + 1}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </Container>
          )}

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
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <h2 className="mb-3 mb-md-0">{keyword ? `${t('Search Results for')} "${keyword}"` : t('Popular Papads')}</h2>
          
          <div className="d-flex gap-3">
            <select 
              className="form-select form-select-sm shadow-sm" 
              style={{ width: 'auto', minWidth: '150px' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {[...new Set(['All', ...products.map(p => p.category)])].map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? t('All Categories') : t(cat)}</option>
              ))}
            </select>
            
            <select 
              className="form-select form-select-sm shadow-sm" 
              style={{ width: 'auto', minWidth: '150px' }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">{t('Sort By: Default')}</option>
              <option value="price-low">{t('Price: Low to High')}</option>
              <option value="price-high">{t('Price: High to Low')}</option>
              <option value="rating">{t('Top Rated')}</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Row>
            {products
              .filter(p => category === 'All' || p.category === category)
              .sort((a, b) => {
                if (sortOrder === 'price-low') return a.price - b.price;
                if (sortOrder === 'price-high') return b.price - a.price;
                if (sortOrder === 'rating') return b.rating - a.rating;
                return 0; // default
              })
              .map((product) => (
              <Col key={product._id} xs={6} sm={6} md={6} lg={4} xl={4} className="mb-4">
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
