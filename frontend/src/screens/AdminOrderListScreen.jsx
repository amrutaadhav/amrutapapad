import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Container } from 'react-bootstrap';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import axios from 'axios';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';

const AdminOrderListScreen = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const userInfo = useStore((state) => state.userInfo);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('/api/orders', config);
          setOrders(data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,User,Date,Total,Paid,Delivered\n";
    
    orders.forEach(order => {
      const userName = order.user ? order.user.name : "Unknown User";
      const paidStr = order.isPaid ? order.paidAt.substring(0, 10) : "No";
      const devStr = order.isDelivered ? order.deliveredAt.substring(0, 10) : "No";
      const row = `${order._id},"${userName}",${order.createdAt.substring(0, 10)},${order.totalPrice},${paidStr},${devStr}`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="m-0">{t('Orders')}</h1>
        <Button variant="outline-success" onClick={exportToCSV}>
          {t('Export to CSV')}
        </Button>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm bg-white">
          <thead className="bg-light">
            <tr>
              <th>{t('ID')}</th>
              <th>{t('USER')}</th>
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
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>₹{order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      {t('Details')}
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminOrderListScreen;
