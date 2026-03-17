import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card, Container } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';

const CartScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cartItems = useStore((state) => state.cartItems);
  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);

  const checkoutHandler = () => {
    navigate('/shipping');
  };

  const whatsappCheckoutHandler = () => {
    const phoneNumber = "919270721017";
    let message = "Hello Amruta Papad! I would like to place an order:%0a%0a";
    
    cartItems.forEach((item, index) => {
      const spice = item.spiceLevel ? ` - Spice: ${item.spiceLevel}` : '';
      const size = item.packagingSize ? ` - Size: ${item.packagingSize}` : '';
      const sub = item.subscription ? ` - ${item.subscription}` : '';
      message += `${index + 1}. *${item.name}*${spice}${size}${sub} - Qty: ${item.qty} - Price: ₹${item.price}%0a`;
    });
    
    const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
    message += `%0a*Total Amount: ₹${total}*%0a%0aPlease let me know how I can arrange delivery!`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h2 className="mb-4 text-primary">{t('Shopping Cart')}</h2>
          {cartItems.length === 0 ? (
            <div className="alert alert-info">
              {t('Your cart is empty')} <Link to="/">{t('Go Back')}</Link>
            </div>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.cartId || item._id} className="cart-item">
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`} className="text-decoration-none text-dark fw-bold">
                        {t(item.name)}
                      </Link>
                      <div className="text-muted" style={{ fontSize: '12px' }}>
                        {item.spiceLevel && <span>{t('Spice')}: {item.spiceLevel} | </span>}
                        {item.packagingSize && <span>{t('Size')}: {item.packagingSize} | </span>}
                        {item.subscription && <span>{t('Type')}: {item.subscription}</span>}
                      </div>
                    </Col>
                    <Col md={2}>₹{item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          addToCart({ ...item, qty: Number(e.target.value) })
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeFromCart(item.cartId || item._id)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4} className="mt-5 mt-md-0">
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  {t('Subtotal')} ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  {t('items')}
                </h2>
                <h3 className="text-primary mt-3">
                  ₹
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="w-100 btn-primary-custom mb-3"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  {t('Proceed To Website Checkout')}
                </Button>
                
                <div className="text-center text-muted mb-3" style={{ fontSize: '14px' }}>{t('OR')}</div>
                
                <Button
                  type="button"
                  className="w-100"
                  variant="success"
                  style={{ fontWeight: 'bold' }}
                  disabled={cartItems.length === 0}
                  onClick={whatsappCheckoutHandler}
                >
                  {t('Order Directly on WhatsApp')}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartScreen;
