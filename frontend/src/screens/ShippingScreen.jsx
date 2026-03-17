import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ShippingScreen = () => {
  const { t } = useTranslation();
  const shippingAddress = useStore((state) => state.shippingAddress);
  const saveShippingAddress = useStore((state) => state.saveShippingAddress);
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'India');

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/placeorder');
  };

  return (
    <Container className="py-4">
      <h2>{t('Shipping')} {t('Address')}</h2>
      <Form onSubmit={submitHandler} className="mt-4 bg-white p-4 shadow-sm rounded">
        <Form.Group controlId="address" className="mb-3">
          <Form.Label>{t('Address')}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t('Address')}
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" className="mb-3">
          <Form.Label>{t('City')}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t('City')}
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" className="mb-3">
          <Form.Label>{t('Postal Code')}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t('Postal Code')}
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" className="mb-3">
          <Form.Label>{t('Country')}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t('Country')}
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="btn-primary-custom mt-2">
          {t('Continue')}
        </Button>
      </Form>
    </Container>
  );
};

export default ShippingScreen;
