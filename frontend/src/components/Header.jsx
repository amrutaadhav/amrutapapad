import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Button, Form, InputGroup, Offcanvas } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaShoppingCart, FaUser, FaSun, FaMoon, FaGlobe, FaSearch, FaMicrophone, FaHome, FaList } from 'react-icons/fa';
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
    <>
    <header>
      <Navbar variant="dark" expand="lg" collapseOnSelect className="navbar py-3" sticky="top">
        <Container className="d-flex flex-wrap align-items-center justify-content-between">
          <LinkContainer to="/">
            <Navbar.Brand className="brand-title d-flex align-items-center">
              <img
                src="/logo.jpeg"
                alt="Amruta Papad Logo"
                height="40"
                className="d-inline-block align-top me-2 rounded-circle"
              />
              <span style={{ fontSize: '1.5rem' }}>Amruta Papad</span>
            </Navbar.Brand>
          </LinkContainer>

          {/* Quick Icons for Small Devices on top navbar */}
          <div className="d-flex align-items-center d-lg-none ms-auto me-3">
             <Button variant="link" className="text-white p-0 me-3" onClick={toggleTheme}>
               {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
             </Button>
             <LinkContainer to="/cart">
               <Nav.Link className="me-3 position-relative text-white">
                  <FaShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <Badge pill bg="warning" className="position-absolute text-dark" style={{ top: '-8px', right: '-10px', fontSize: '0.6rem' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
               </Nav.Link>
             </LinkContainer>
             <LinkContainer to={userInfo ? "/profile" : "/login"}>
               <Nav.Link className="text-white">
                  <FaUser size={20} />
               </Nav.Link>
             </LinkContainer>
          </div>

          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" className="border-0 px-0"/>

          {/* Search bar below the navbar for small devices */}
          <div className="w-100 mt-3 d-lg-none flex-grow-1">
            <Form onSubmit={submitSearchHandler} className="d-flex">
              <InputGroup size="sm" className="w-100">
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
          </div>

          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-lg"
            aria-labelledby="offcanvasNavbarLabel-expand-lg"
            placement="start"
            className="bg-dark text-white"
          >
            <Offcanvas.Header closeButton closeVariant="white">
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                Amruta Papad
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {/* Desktop Search Bar */}
              <Form onSubmit={submitSearchHandler} className="d-none d-lg-flex ms-auto my-2 my-lg-0 align-items-center pe-3">
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

              <Nav className="ms-auto align-items-lg-center">
                {/* Sidebar Full Names with Icons (Mobile specific links, also fallback or complementary desktop) */}
                <LinkContainer to="/" className="d-lg-none my-2">
                  <Nav.Link className="d-flex align-items-center"><FaHome className="me-3" size={20}/> <span style={{fontSize: '1.1rem'}}>{t('Home')}</span></Nav.Link>
                </LinkContainer>
                <LinkContainer to="/categories" className="d-lg-none my-2">
                  <Nav.Link className="d-flex align-items-center"><FaList className="me-3" size={20}/> <span style={{fontSize: '1.1rem'}}>{t('Categories')}</span></Nav.Link>
                </LinkContainer>

                {/* Desktop Theme Toggle */}
                <Button variant="link" className="text-white p-0 mx-3 d-none d-lg-block" onClick={toggleTheme} style={{ fontSize: '1.2rem' }}>
                  {theme === 'light' ? <FaMoon /> : <FaSun />}
                </Button>

                {/* Language */}
                <NavDropdown title={<><FaGlobe className="me-1"/> {i18n.language.toUpperCase()}</>} id="languagemenu" className="me-2 my-2 my-lg-0">
                   <NavDropdown.Item onClick={() => changeLanguage('en')}>English (EN)</NavDropdown.Item>
                   <NavDropdown.Item onClick={() => changeLanguage('mr')}>मराठी (MR)</NavDropdown.Item>
                </NavDropdown>

                {/* Desktop Cart */}
                <LinkContainer to="/cart" className="d-none d-lg-block">
                  <Nav.Link>
                    <FaShoppingCart className="me-1" /> {t('Cart')}
                    {cartItems.length > 0 && (
                      <Badge pill bg="warning" className="ms-1 text-dark">
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>
                
                {/* Accounts */}
                {userInfo ? (
                  <NavDropdown title={<><span className="d-lg-none"><FaUser className="me-2"/></span>{userInfo.name}</>} id="username" className="my-2 my-lg-0">
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
                  <LinkContainer to="/login" className="d-none d-lg-block">
                    <Nav.Link>
                      <FaUser className="me-1" /> {t('Sign In')}
                    </Nav.Link>
                  </LinkContainer>
                )}
                
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title={t('Admin')} id="adminmenu" className="my-2 my-lg-0">
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
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </header>

    {/* Mobile Bottom Navigation Bar */}
    <div className="mobile-bottom-nav">
      <LinkContainer to="/">
        <Nav.Link>
          <FaHome />
          <span>{t('Home')}</span>
        </Nav.Link>
      </LinkContainer>
      <LinkContainer to="/categories">
        <Nav.Link>
          <FaList />
          <span>{t('Categories')}</span>
        </Nav.Link>
      </LinkContainer>
      {userInfo ? (
        <LinkContainer to="/profile">
          <Nav.Link>
            <FaUser />
            <span>{t('Account')}</span>
          </Nav.Link>
        </LinkContainer>
      ) : (
        <LinkContainer to="/login">
          <Nav.Link>
            <FaUser />
            <span>{t('Login')}</span>
          </Nav.Link>
        </LinkContainer>
      )}
      <LinkContainer to="/cart" className="position-relative">
        <Nav.Link>
          <FaShoppingCart />
          <span>{t('Cart')}</span>
          {cartItems.length > 0 && (
            <Badge pill bg="warning" className="position-absolute text-dark" style={{ top: '-5px', right: '10px', fontSize: '0.6rem' }}>
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </Badge>
          )}
        </Nav.Link>
      </LinkContainer>
    </div>
    </>
  );
};

export default Header;
