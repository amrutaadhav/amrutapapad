import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy, useEffect } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import { useStore } from './store';
import axios from 'axios';
import Loader from './components/Loader';

// Dynamic Mobile-Optimized Code Splitting
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const ProductScreen = lazy(() => import('./screens/ProductScreen'));
const CartScreen = lazy(() => import('./screens/CartScreen'));
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const RegisterScreen = lazy(() => import('./screens/RegisterScreen'));
const ProductListScreen = lazy(() => import('./screens/ProductListScreen'));
const ProductEditScreen = lazy(() => import('./screens/ProductEditScreen'));
const WishlistScreen = lazy(() => import('./screens/WishlistScreen'));
const AdminDashboardScreen = lazy(() => import('./screens/AdminDashboardScreen'));
const AdminSettingsScreen = lazy(() => import('./screens/AdminSettingsScreen'));
const AdminOrderListScreen = lazy(() => import('./screens/AdminOrderListScreen'));
const ShippingScreen = lazy(() => import('./screens/ShippingScreen'));
const PlaceOrderScreen = lazy(() => import('./screens/PlaceOrderScreen'));
const OrderScreen = lazy(() => import('./screens/OrderScreen'));
const CategoryScreen = lazy(() => import('./screens/CategoryScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const AboutScreen = lazy(() => import('./screens/AboutScreen'));

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
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/search/:keyword" element={<HomeScreen />} />
            <Route path="/categories" element={<CategoryScreen />} />
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
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
