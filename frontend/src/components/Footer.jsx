import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer-elegant">
      <Container>
        <Row className="text-center text-md-start">
          <Col md={4} className="mb-4">
            <h5 className="footer-brand">{t('Amruta Papad')}</h5>
            <p className="footer-desc mt-3">{t('Bringing you the authentic taste of tradition. Handcrafted, crispy, and flavorful papads for every meal.')}</p>
          </Col>
          <Col md={4} className="mb-4 footer-links">
            <h5 className="footer-title">{t('Quick Links')}</h5>
            <ul className="list-unstyled mt-3">
              <li><i className="fas fa-chevron-right me-2"></i><Link to="/" className="text-decoration-none">{t('Home')}</Link></li>
              <li><i className="fas fa-chevron-right me-2"></i><Link to="/" className="text-decoration-none">{t('Our Products')}</Link></li>
              <li><i className="fas fa-chevron-right me-2"></i><Link to="/about" className="text-decoration-none">{t('About Us')}</Link></li>
              <li><i className="fas fa-chevron-right me-2"></i><Link to="/cart" className="text-decoration-none">{t('Shopping Cart')}</Link></li>
            </ul>
          </Col>
          <Col md={4} className="mb-4 footer-contact">
            <h5 className="footer-title">{t('Contact Us')}</h5>
            <div className="mt-3">
              <p className="mb-2"><i className="fas fa-map-marker-alt me-3"></i>{t('123 Street, Food Valley Dt.')}</p>
              <p className="mb-2"><i className="fas fa-envelope me-3"></i>contact:amrutagruhudyog@gmail.com</p>
              <p className="mb-2"><i className="fas fa-phone-alt me-3"></i>+91 9270721017</p>
              <p className="mb-2"><i className="fas fa-phone-alt me-3" style={{visibility: 'hidden'}}></i>+91 9011331017</p>
              <p className="mb-2"><i className="fas fa-phone-alt me-3" style={{visibility: 'hidden'}}></i>+91 9960255848</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-4 border-top border-secondary mt-3 footer-bottom">
            <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} <span className="text-light">{t('Amruta Papad')}</span>. {t('All Rights Reserved.')}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
