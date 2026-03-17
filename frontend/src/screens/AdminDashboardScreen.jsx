import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';

const AdminDashboardScreen = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = useStore((state) => state.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const summaryPromise = axios.get('/api/orders/summary', config);
        const productsPromise = axios.get('/api/products');
        
        const [summaryData, productsData] = await Promise.all([summaryPromise, productsPromise]);
        
        setSummary(summaryData.data);
        setProducts(productsData.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchSummary();
  }, [userInfo, navigate]);

  return (
    <Container className="py-4">
      <h1 className="mb-4">{t('Admin Dashboard')}</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4} className="mb-3 mb-md-0">
              <Card className="shadow-sm border-0 text-center text-white bg-primary h-100">
                <Card.Body>
                  <Card.Title>{t('Total Sales')}</Card.Title>
                  <Card.Text className="fs-2 fw-bold">₹{summary.totalSales.toFixed(2)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
              <Card className="shadow-sm border-0 text-center text-white bg-success h-100">
                <Card.Body>
                  <Card.Title>{t('Total Orders')}</Card.Title>
                  <Card.Text className="fs-2 fw-bold">{summary.totalOrders}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0 text-center text-white bg-warning h-100">
                <Card.Body>
                  <Card.Title className="text-dark">{t('Total Users')}</Card.Title>
                  <Card.Text className="fs-2 fw-bold text-dark">{summary.totalUsers}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {products.filter(p => p.countInStock <= 5).length > 0 && (
            <Card className="shadow-sm border-0 mb-4 border-start border-warning border-5">
              <Card.Body>
                <Card.Title className="text-warning mb-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {t('Smart Inventory Prediction Alerts')}
                </Card.Title>
                <p className="text-muted">{t('The following products are running out of stock. Please restock them soon to prevent revenue loss.')}</p>
                <div className="table-responsive">
                  <table className="table table-hover table-sm">
                    <thead>
                      <tr>
                        <th>{t('Product Name')}</th>
                        <th>{t('Current Stock')}</th>
                        <th>{t('Status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.filter(p => p.countInStock <= 5).map(product => (
                        <tr key={product._id}>
                          <td>{product.name}</td>
                          <td className="fw-bold text-danger">{product.countInStock}</td>
                          <td>
                            <span className={`badge ${product.countInStock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                               {product.countInStock === 0 ? t('Out of Stock') : t('Low Stock')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          )}

          <Card className="shadow-sm border-0 p-3">
            <Card.Body>
              <Card.Title className="mb-4">{t('Sales Analytics (Daily)')}</Card.Title>
              {summary.dailyOrders.length === 0 ? (
                <Message>{t('No Sales Data Available')}</Message>
              ) : (
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={summary.dailyOrders}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="var(--secondary-color)" name={t('Sales (₹)')} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default AdminDashboardScreen;
