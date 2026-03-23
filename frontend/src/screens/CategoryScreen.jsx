import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const categories = [
  {
    name: 'Papad',
    image: 'https://res.cloudinary.com/dukzvvjrl/image/upload/v1773975245/amrutapapad_uploads/b6ezeqqjwo6gkmabml56.jpg',
  },
  {
    name: 'Shevai',
    image: 'https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286208/6_ymx90e.jpg',
  },
  {
    name: 'Masale',
    image: 'https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286223/5_vyj9x7.jpg',
  },
  {
    name: 'Sandage',
    image: 'https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286220/4_ckrqkd.jpg',
  }
];

const CategoryScreen = () => {
  const { t } = useTranslation();

  return (
    <Container className="my-5">
      <h2 className="text-center mb-5" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
        {t('Shop By Category')}
      </h2>
      <Row className="g-4 justify-content-center">
        {categories.map((cat, idx) => (
          <Col key={idx} xs={6} md={3}>
            <Link to="/" state={{ category: cat.name }} className="text-decoration-none">
              <Card className="h-100 border-0 shadow-sm category-card text-center" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'transform 0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <Card.Img variant="top" src={cat.image} style={{ height: '150px', objectFit: 'cover' }} />
                <Card.Body className="bg-light">
                  <Card.Title className="m-0 text-dark" style={{ fontWeight: '600' }}>{t(cat.name)}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoryScreen;
