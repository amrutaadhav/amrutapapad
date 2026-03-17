import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';

const AdminSettingsScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userInfo = useStore((state) => state.userInfo);

  const [offerText, setOfferText] = useState('');
  const [offerIsActive, setOfferIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/settings');
        setOfferText(data.offerText || '');
        setOfferIsActive(data.offerIsActive !== false); // default to true
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchSettings();
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put('/api/settings', { offerText, offerIsActive }, config);
      setSuccess('Store Settings Updated!');
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">{t('Store Settings')}</h2>
      
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">{success}</Message>}

      <Form onSubmit={submitHandler} className="bg-white p-4 rounded shadow-sm">
        <Form.Group controlId="offerIsActive" className="mb-3">
          <Form.Check 
            type="checkbox" 
            label={t('Show Festival Offer Banner')} 
            checked={offerIsActive}
            onChange={(e) => setOfferIsActive(e.target.checked)}
          />
        </Form.Group>

        <Form.Group controlId="offerText" className="mb-3">
          <Form.Label>{t('Offer Text')}</Form.Label>
          <Form.Control 
            type="text" 
            placeholder={t('Enter promotional offer text')} 
            value={offerText}
            onChange={(e) => setOfferText(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="btn-primary-custom">
          {t('Save Changes')}
        </Button>
      </Form>
    </Container>
  );
};

export default AdminSettingsScreen;
