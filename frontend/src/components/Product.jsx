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
    
    const isNowWishlisted = !inWishlist;
    setInWishlist(isNowWishlisted); // instant visual feedback

    if (!userInfo) {
      if (isNowWishlisted) {
        setWishlist([...wishlist, product]);
      } else {
        setWishlist(wishlist.filter(item => item._id !== product._id));
      }
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
    <Card className="my-2 my-sm-3 p-2 p-sm-3 rounded product-card position-relative h-100 d-flex flex-column">
      <Button 
        variant="light" 
        className="position-absolute rounded-circle shadow-sm" 
        style={{ top: '10px', right: '10px', zIndex: 10, padding: '5px' }}
        onClick={toggleWishlistHandler}
      >
        {inWishlist ? <FaHeart color="red" size={16} /> : <FaRegHeart color="gray" size={16} />}
      </Button>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" className="rounded" />
      </Link>

      <Card.Body className="d-flex flex-column p-2 p-sm-3">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Title as="div" className="product-title" style={{ fontSize: '1.1rem', minHeight: '2.5rem' }}>
            <strong>{t(product.name)}</strong>
          </Card.Title>
        </Link>
        
        <Card.Text as="div" className="mt-2 text-muted d-none d-sm-block flex-grow-1">
          {product.description.substring(0, 50)}...
        </Card.Text>

        <Card.Text as="div" className="my-1 my-sm-3" style={{ fontSize: '0.9rem' }}>
          <Rating
            value={product.rating}
            text={<span className="d-none d-sm-inline">{`${product.numReviews} ${t('reviews')}`}</span>}
          />
        </Card.Text>

        <Card.Text as="div" className="product-price mt-auto" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
          {product.originalPrice > product.price && (
             <span className="text-muted text-decoration-line-through me-1" style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>
               ₹{product.originalPrice}
             </span>
          )}
          <br className="d-block d-sm-none" />
          ₹{product.price} <span style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>/ kg</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
