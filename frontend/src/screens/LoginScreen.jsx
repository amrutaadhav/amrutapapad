import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginScreen = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const loginStore = useStore((state) => state.login);
  const userInfo = useStore((state) => state.userInfo);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/login', { email, password }, config);
      loginStore(data);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1 className="mb-4">{t('Sign In')}</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={submitHandler} className="bg-white p-4 rounded shadow-sm">
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>{t('Email Address')}</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password" style={{ position: 'relative' }}>
              <Form.Label>{t('Password')}</Form.Label>
              <div className="d-flex align-items-center position-relative">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', cursor: 'pointer', zIndex: 10, color: '#6c757d' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </Form.Group>

            <Button type="submit" className="btn-primary-custom w-100">
              {t('Sign In')}
            </Button>
          </Form>

          <Row className="py-3">
            <Col>
              {t('New Customer?')} <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                {t('Register')}
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
