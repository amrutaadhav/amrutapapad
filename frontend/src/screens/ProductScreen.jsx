import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Container, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';

const ProductScreen = () => {
  const { t } = useTranslation();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useStore((state) => state.addToCart);
  const userInfo = useStore((state) => state.userInfo);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [packagingSize, setPackagingSize] = useState('500g');
  const [subscription, setSubscription] = useState('One-time');

  
  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchProduct();
    setVisitorCount(Math.floor(Math.random() * 20) + 5);
    
    // Randomly fluctuate visitor count every 15 seconds to look realistic
    const interval = setInterval(() => {
       setVisitorCount(prev => prev + Math.floor(Math.random() * 5) - 2 || 5);
    }, 15000);
    
    return () => clearInterval(interval);
  }, [id, reviewSuccess]);

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryMessage(`✅ ${t('Express 2-day delivery available for')} ${pincode}`);
    } else {
      setDeliveryMessage(`❌ ${t('Invalid pincode')}`);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setReviewLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(`/api/products/${id}/reviews`, { rating, comment, images: reviewImages }, config);
      setReviewSuccess(true);
      setReviewLoading(false);
      setRating(0);
      setComment('');
      setReviewImages([]);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      setReviewError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setReviewLoading(false);
    }
  };

  const addToCartHandler = () => {
    addToCart({ ...product, qty, spiceLevel, packagingSize, subscription });
    navigate('/cart');
  };

  const directWhatsappHandler = () => {
    const phoneNumber = "919270721017";
    let message = `Hello Amruta Papad! I would like to quickly order:%0a%0a`;
    message += `1. *${product.name}* - Qty: ${qty} - Total: ₹${(product.price * qty).toFixed(2)}%0a%0a`;
    message += `Please let me know how I can pay and arrange delivery!`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Container>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid className="rounded shadow-sm mb-3" />
            {product.images && product.images.length > 0 && (
              <Row className="gx-2">
                {product.images.map((img, idx) => (
                  <Col key={idx} xs={3}>
                    <Image src={img} fluid className="rounded shadow-sm mb-2" />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
          <Col md={3}>
            <ListGroup variant="flush" className="bg-white p-3 shadow-sm rounded">
              <ListGroup.Item>
                <h3 className="text-dark fw-bold">{t(product.name)}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>{t('Price')}: ₹{product.price}</ListGroup.Item>
              <ListGroup.Item>{t('Description')}: {product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>{t('Price')}:</Col>
                    <Col>
                      <strong>₹{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Row>
                    <Col>{t('Spice Level')}</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={spiceLevel}
                        onChange={(e) => setSpiceLevel(e.target.value)}
                      >
                        <option value="Low">{t('Low')}</option>
                        <option value="Medium">{t('Medium')}</option>
                        <option value="High">{t('High')}</option>
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>{t('Pack Size')}</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={packagingSize}
                        onChange={(e) => setPackagingSize(e.target.value)}
                      >
                        <option value="250g">250g</option>
                        <option value="500g">500g</option>
                        <option value="1kg">1kg</option>
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>

                 <ListGroup.Item>
                  <Row>
                    <Col>{t('Order Type')}</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={subscription}
                        onChange={(e) => setSubscription(e.target.value)}
                      >
                        <option value="One-time">{t('One-time')}</option>
                        <option value="Monthly">{t('Monthly Delivery (Sub)')}</option>
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>


                <ListGroup.Item>
                  <Button
                    className="w-100 btn-primary-custom mb-3"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    {t('Add To Cart')}
                  </Button>

                  <div className="text-center text-muted mb-3" style={{ fontSize: '14px' }}>OR</div>

                  <Button
                    className="w-100"
                    variant="success"
                    style={{ fontWeight: 'bold' }}
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={directWhatsappHandler}
                  >
                    {t('Order on WhatsApp')}
                  </Button>
                </ListGroup.Item>
                
                <ListGroup.Item className="bg-light">
                   <div style={{ fontSize: '14px', color: '#c0392b', fontWeight: 'bold' }}>
                     🔥 {visitorCount} {t('people are viewing this right now!')}
                   </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>

            <Card className="mt-3 p-3 text-center border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
               <h5>{t('Check Delivery')}</h5>
               <Form.Group className="d-flex mt-2">
                 <Form.Control 
                    type="text" 
                    placeholder={t('Enter Pincode')} 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength="6"
                 />
                 <Button variant="dark" className="ms-2" onClick={checkDelivery}>{t('Check')}</Button>
               </Form.Group>
               {deliveryMessage && <div className="mt-2 text-primary" style={{ fontSize: '14px', fontWeight: 'bold' }}>{deliveryMessage}</div>}
            </Card>
          </Col>
        </Row>
      )}
      
      {!loading && !error && (
        <>
          <Row className="mt-5 bg-white p-4 shadow-sm border rounded">
             <Col md={12}>
               <h3 className="text-secondary mb-3">{t('Health & Nutrition Facts')}</h3>
               <Row>
                 <Col md={4}>
                    <ul className="list-unstyled">
                      <li><strong className="text-primary">{t('Calories')}:</strong> 150 per 100g</li>
                      <li><strong className="text-primary">{t('Protein')}:</strong> 12g</li>
                      <li><strong className="text-primary">{t('Carbohydrates')}:</strong> 25g</li>
                    </ul>
                 </Col>
                 <Col md={8}>
                    <p><strong>{t('Key Ingredients')}:</strong> Urad Dal flour, Asafoetida (Hing), Black Pepper, Cumin, Premium Sea Salt, Cold-pressed Oil.</p>
                    <p><strong>{t('Health Benefits')}:</strong> Amruta Papad is high in protein and dietary fiber, promoting healthy digestion. Made strictly with 100% natural spices without any synthetic preservatives.</p>
                 </Col>
               </Row>
             </Col>
          </Row>

          <Row className="mt-5">
            <Col md={6}>
              <h2>{t('Reviews')}</h2>
              {product.reviews.length === 0 && <Message>{t('No Reviews')}</Message>}
            <ListGroup variant="flush">
              {product.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="d-flex gap-2 mb-2 flex-wrap">
                      {review.images.map((img, idx) => (
                        <Image key={idx} src={img} rounded style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                      ))}
                    </div>
                  )}
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h2>{t('Write a Customer Review')}</h2>
                {reviewSuccess && (
                  <Message variant="success">Review submitted successfully</Message>
                )}
                {reviewError && (
                  <Message variant="danger">{reviewError}</Message>
                )}
                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="rating" className="mb-3">
                      <Form.Label>{t('Rating')}</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                      >
                        <option value="">{t('Select...')}</option>
                        <option value="1">1 - {t('Poor')}</option>
                        <option value="2">2 - {t('Fair')}</option>
                        <option value="3">3 - {t('Good')}</option>
                        <option value="4">4 - {t('Very Good')}</option>
                        <option value="5">5 - {t('Excellent')}</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="comment" className="mb-3">
                      <Form.Label>{t('Comment')}</Form.Label>
                      <Form.Control
                        as="textarea"
                        row="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="review-images" className="mb-3">
                      <Form.Label>{t('Upload Photos (Optional)')}</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        onChange={async (e) => {
                          const files = e.target.files;
                          const formData = new FormData();
                          for (let i = 0; i < files.length; i++) {
                            formData.append('images', files[i]);
                          }
                          setUploading(true);
                          try {
                            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                            const { data } = await axios.post('/api/upload/multiple', formData, config);
                            setReviewImages([...reviewImages, ...data]);
                            setUploading(false);
                          } catch (error) {
                            console.error(error);
                            setUploading(false);
                          }
                        }}
                      ></Form.Control>
                      {uploading && <Loader />}
                    </Form.Group>
                    {reviewImages.length > 0 && (
                      <div className="mb-3 d-flex gap-2 flex-wrap">
                        {reviewImages.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative' }}>
                            <img src={img} alt="Review" style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded" />
                            <Button 
                              variant="danger" 
                              size="sm" 
                              style={{ padding: '0 4px', fontSize: '10px' }}
                              className="position-absolute top-0 end-0 m-1"
                              onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== idx))}
                            >X</Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      disabled={reviewLoading}
                      type="submit"
                      variant="primary"
                    >
                      {t('Submit')}
                    </Button>
                  </Form>
                ) : (
                  <Message>
                    {t('Please')} <Link to="/login">{t('sign in')}</Link> {t('to write a review')}
                  </Message>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        </>
      )}
    </Container>
  );
};

export default ProductScreen;
