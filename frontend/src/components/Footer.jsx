import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer shadow-lg">
      <Container>
        <Row className="text-center text-md-start">
          <Col md={4} className="mb-4">
            <h5>{t('Amruta Papad')}</h5>
            <p>{t('Bringing you the authentic taste of tradition. Handcrafted, crispy, and flavorful papads for every meal.')}</p>
          </Col>
          <Col md={4} className="mb-4">
            <h5>{t('Quick Links')}</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">{t('Home')}</a></li>
              <li><a href="/" className="text-light text-decoration-none">{t('Our Products')}</a></li>
              <li><a href="/cart" className="text-light text-decoration-none">{t('Shopping Cart')}</a></li>
            </ul>
          </Col>
          <Col md={4} className="mb-4">
            <h5>{t('Contact Us')}</h5>
            <p className="mb-1">{t('123 Street, Food Valley Dt.')}</p>
            <p className="mb-1">contact@amrutapapad.com</p>
            <p>+91 9270721017/9011331017/9960255848</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3 border-top border-secondary mt-3">
            <p className="mb-0">&copy; {new Date().getFullYear()} {t('Amruta Papad')}. {t('All Rights Reserved.')}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
