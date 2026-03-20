import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Rating from './Rating';
import { useStore } from '../store';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Product = ({ product }) => {
  const { t } = useTranslation();
  const userInfo = useStore((state) => state.userInfo);
  const wishlist = useStore((state) => state.wishlist);
  const setWishlist = useStore((state) => state.setWishlist);
  const navigate = useNavigate();

  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (wishlist && product) {
      setInWishlist(wishlist.includes(product._id) || wishlist.some(item => item._id === product._id));
    }
  }, [wishlist, product]);

  const toggleWishlistHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setInWishlist(!inWishlist); // instant visual feedback

    if (!userInfo) {
      return; // If not logged in, just pretend it's added visually for now
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('/api/users/wishlist', { productId: product._id }, config);
      setWishlist(data);
    } catch (error) {
      console.error(error);
      setInWishlist(false); // revert if backend fails
    }
  };

  return (
    <Card className="my-3 p-3 rounded product-card position-relative">
      <Button 
        variant="light" 
        className="position-absolute rounded-circle shadow-sm" 
        style={{ top: '15px', right: '15px', zIndex: 10, padding: '8px' }}
        onClick={toggleWishlistHandler}
      >
        {inWishlist ? <FaHeart color="red" size={20} /> : <FaRegHeart color="gray" size={20} />}
      </Button>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Title as="div" className="product-title">
            <strong>{t(product.name)}</strong>
          </Card.Title>
        </Link>
        
        <Card.Text as="div" className="mt-2 text-muted">
          {product.description.substring(0, 50)}...
        </Card.Text>

        <Card.Text as="div" className="my-3">
          <Rating
            value={product.rating}
            text={`${product.numReviews} ${t('customer reviews')}`}
          />
        </Card.Text>

        <Card.Text as="h3" className="product-price">
          ₹{product.price} / kg
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
