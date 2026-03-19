import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import WishlistScreen from './screens/WishlistScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminSettingsScreen from './screens/AdminSettingsScreen';
import AdminOrderListScreen from './screens/AdminOrderListScreen';
import ShippingScreen from './screens/ShippingScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import AboutScreen from './screens/AboutScreen';
import { useStore } from './store';
import { useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const theme = useStore((state) => state.theme);
  const userInfo = useStore((state) => state.userInfo);
  const setWishlist = useStore((state) => state.setWishlist);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (userInfo) {
      const getWishlist = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('/api/users/wishlist', config);
          setWishlist(data);
        } catch (error) {
          console.error('Error fetching wishlist', error);
        }
      };
      getWishlist();
    }
  }, [userInfo, setWishlist]);
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/search/:keyword" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/wishlist" element={<WishlistScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/admin/productlist" element={<ProductListScreen />} />
          <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
          <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
          <Route path="/admin/settings" element={<AdminSettingsScreen />} />
          <Route path="/admin/orderlist" element={<AdminOrderListScreen />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
