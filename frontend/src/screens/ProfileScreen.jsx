import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useStore } from '../store';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState('');

  const navigate = useNavigate();
  const userInfo = useStore((state) => state.userInfo);
  const addToCart = useStore((state) => state.addToCart);

  const reorderHandler = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if(order && order.orderItems) {
      order.orderItems.forEach(item => {
         addToCart({_id: item.product, ...item, qty: item.qty});
      });
      navigate('/cart');
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      
      const fetchMyOrders = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('/api/orders/myorders', config);
          setOrders(data);
          setLoadingOrders(false);
        } catch (error) {
          setErrorOrders(error.response?.data?.message || error.message);
          setLoadingOrders(false);
        }
      };
      fetchMyOrders();
    }
  }, [userInfo, navigate]);

  return (
    <Container className="py-4">
      <Row>
        <Col md={3}>
          <h2>{t('User Profile')}</h2>
          <Form className="bg-white p-4 rounded shadow-sm">
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>{t('Name')}</Form.Label>
              <Form.Control type="name" value={name} readOnly></Form.Control>
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>{t('Email Address')}</Form.Label>
              <Form.Control type="email" value={email} readOnly></Form.Control>
            </Form.Group>
          </Form>
        </Col>
        <Col md={9}>
          <h2>{t('My Orders')}</h2>
          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <Message variant="danger">{errorOrders}</Message>
          ) : (
            <Table striped bordered hover responsive className="table-sm bg-white shadow-sm">
              <thead>
                <tr>
                  <th>{t('ID')}</th>
                  <th>{t('DATE')}</th>
                  <th>{t('TOTAL')}</th>
                  <th>{t('PAID')}</th>
                  <th>{t('DELIVERED')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 10)}...</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>₹{order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i className="fas fa-times" style={{ color: 'red' }}>Pending</i>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <i className="fas fa-times" style={{ color: 'red' }}>No</i>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-2">
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className="btn-sm btn-light border" variant="light">
                            {t('Details')}
                          </Button>
                        </LinkContainer>
                        <Button className="btn-sm btn-warning fw-bold text-dark" onClick={() => reorderHandler(order._id)}>
                          {t('Reorder')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;
