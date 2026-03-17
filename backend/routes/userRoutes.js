const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  deleteUser,
  getUserWishlist,
  toggleWishlist,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/wishlist').get(protect, getUserWishlist).post(protect, toggleWishlist);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
