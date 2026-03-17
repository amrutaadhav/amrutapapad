import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Image, Card, Button, Container } from 'react-bootstrap';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import axios from 'axios';
import Loader from '../components/Loader';
import { useTranslation } from 'react-i18next';

const PlaceOrderScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cartItems = useStore((state) => state.cartItems);
  const shippingAddress = useStore((state) => state.shippingAddress);
  const userInfo = useStore((state) => state.userInfo);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  
  // Free shipping above ₹500, else ₹50
  const shippingPrice = addDecimals(itemsPrice > 500 ? 0 : 50);
  const taxPrice = addDecimals(Number((0.05 * itemsPrice).toFixed(2))); // 5% GST
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
    if (!userInfo) {
       navigate('/login');
    }
  }, [shippingAddress, navigate, userInfo]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress: shippingAddress,
          paymentMethod: 'Razorpay',
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config
      );

      setLoading(false);
      useStore.setState({ cartItems: [] }); // Clear local cart
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <ListGroup variant="flush" className="bg-white p-3 shadow-sm rounded">
            <ListGroup.Item>
              <h2>{t('Shipping')} {t('Address')}</h2>
              <p>
                <strong>{t('Address')}: </strong>
                {shippingAddress.address}, {shippingAddress.city}{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>{t('Payment Method')}</h2>
              <strong>Method: </strong> Razorpay / Card
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>{t('Order Items')}</h2>
              {cartItems.length === 0 ? (
                <Message>{t('Your cart is empty')}</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="align-items-center">
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {t(item.name)}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹{addDecimals(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        
        <Col md={4} className="mt-4 mt-md-0">
          <Card className="shadow-sm border-0">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>{t('Order Summary')}</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{t('Items')}</Col>
                  <Col>₹{itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{t('Shipping')}</Col>
                  <Col>₹{shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>{t('Tax')}</Col>
                  <Col>₹{taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="bg-light">
                <Row>
                  <Col><strong>{t('Total')}</strong></Col>
                  <Col><strong>₹{totalPrice}</strong></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="w-100 btn-primary-custom"
                  disabled={cartItems.length === 0 || loading}
                  onClick={placeOrderHandler}
                >
                  {t('Place Order')}
                </Button>
                {loading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderScreen;
