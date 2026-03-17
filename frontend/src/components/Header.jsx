import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaShoppingCart, FaUser, FaSun, FaMoon, FaGlobe, FaSearch, FaMicrophone } from 'react-icons/fa';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  
  const userInfo = useStore((state) => state.userInfo);
  const cartItems = useStore((state) => state.cartItems);
  const logout = useStore((state) => state.logout);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const setLanguageState = useStore((state) => state.setLanguage);

  const logoutHandler = () => {
    logout();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguageState(lng);
  };

  const submitSearchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = i18n.language === 'mr' ? 'mr-IN' : 'en-US';
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setKeyword(transcript);
        navigate(`/search/${transcript}`);
      };
    } else {
      alert('Voice search not supported in this browser.');
    }
  };

  return (
    <header>
      <Navbar variant="dark" expand="lg" collapseOnSelect className="navbar py-3">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="brand-title d-flex align-items-center">
              <img
                src="/logo.png"
                alt="Amruta Papad Logo"
                height="40"
                className="d-inline-block align-top me-2 rounded-circle"
              />
              <span style={{ fontSize: '1.5rem' }}>Amruta Papad</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Form onSubmit={submitSearchHandler} className="d-flex ms-auto my-2 my-lg-0 align-items-center">
              <InputGroup size="sm" style={{ maxWidth: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder={t('Search products...')}
                  onChange={(e) => setKeyword(e.target.value)}
                  value={keyword}
                />
                <Button variant="light" type="submit" className="border">
                  <FaSearch color="var(--primary-color)" />
                </Button>
                <Button variant="light" onClick={startVoiceSearch} className="border ms-1 rounded-end" title="Voice Search">
                  <FaMicrophone color="red" />
                </Button>
              </InputGroup>
            </Form>

            <Nav className="ms-auto align-items-center">
              <Button variant="link" className="text-white p-0 me-3 ms-3" onClick={toggleTheme} style={{ fontSize: '1.2rem' }}>
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </Button>
              <NavDropdown title={<><FaGlobe className="me-1"/> {i18n.language.toUpperCase()}</>} id="languagemenu" className="me-2">
                 <NavDropdown.Item onClick={() => changeLanguage('en')}>English (EN)</NavDropdown.Item>
                 <NavDropdown.Item onClick={() => changeLanguage('mr')}>मराठी (MR)</NavDropdown.Item>
              </NavDropdown>

              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart className="me-1" /> {t('Cart')}
                  {cartItems.length > 0 && (
                    <Badge pill bg="warning" className="ms-1 text-dark">
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>{t('Profile')}</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/wishlist">
                    <NavDropdown.Item>{t('Wishlist')}</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    {t('Logout')}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser className="me-1" /> {t('Sign In')}
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title={t('Admin')} id="adminmenu">
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>{t('Dashboard')}</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>{t('Users')}</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>{t('Products')}</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>{t('Orders')}</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/settings">
                    <NavDropdown.Item>{t('Store Settings')}</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
