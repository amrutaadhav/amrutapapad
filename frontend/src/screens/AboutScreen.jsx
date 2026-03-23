import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const teamMembers = [
  {
    id: 1,
    name: 'Amruta Jadhav',
    role: 'Founder',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&w=400&q=80',
    description: 'Started the journey from a home kitchen, perfecting the authentic recipes.'
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    role: 'Co-founder (Operations)',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&w=400&q=80',
    description: 'Brought scale and efficiency to our handcrafted papad making process.'
  },
  {
    id: 3,
    name: 'Priya Desai',
    role: 'Co-founder (Finance)',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&w=400&q=80',
    description: 'Ensures our business stays healthy while delivering affordable quality.'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Production Manager',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&w=400&q=80',
    description: 'Oversees the day-to-day traditional rolling and sun-drying of our products.'
  },
  {
    id: 5,
    name: 'Neha Kapoor',
    role: 'Marketing & Branding Head',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&w=400&q=80',
    description: 'The creative mind making Amruta Papad a household name.'
  },
  {
    id: 6,
    name: 'Siddharth Patil',
    role: 'Website Maker & Tech Lead',
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&w=400&q=80',
    description: 'Built this seamless e-commerce platform ensuring a smooth shopping experience.'
  }
];

const AboutScreen = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [activeMember, setActiveMember] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (member) => {
    setActiveMember(member);
    setShow(true);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Blurred Background Layer */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://res.cloudinary.com/dukzvvjrl/image/upload/v1774287204/bg_iit11k.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(6px)',
          WebkitFilter: 'blur(6px)',
          zIndex: -2,
          transform: 'scale(1.05)' // Prevents white edges from blur bleed
        }}
      />
      {/* Overlay to ensure text remains readable */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.70)',
          zIndex: -1
        }}
      />

      <Container className="py-5 position-relative" style={{ zIndex: 1, minHeight: '80vh' }}>
        <h1 className="text-center mb-5 brand-title" style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.8)' }}>{t('About Amruta Papad')}</h1>

        <Row className="mb-5 text-center">
          <Col md={8} className="mx-auto">
            <p className="lead" style={{ fontWeight: '500', color: '#333' }}>
              {t('Amruta Papad was founded with a single vision: to bring authentic, home-style traditional recipes back to modern dining tables. Our papads are still rolled and dried using authentic methods without any artificial preservatives.')}
            </p>
          </Col>
        </Row>

        <h2 className="text-center mb-4" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>{t('Meet Our Team')}</h2>
        <Row className="justify-content-center">
          {teamMembers.map((member) => (
            <Col key={member.id} xs={12} sm={6} md={4} className="mb-4">
              <Card 
                className="border-0 shadow-hover text-center h-100" 
                style={{ cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                onClick={() => handleShow(member)}
              >
                <Card.Img 
                  variant="top" 
                  src={member.image} 
                  style={{ height: '250px', objectFit: 'cover', borderRadius: '50%', padding: '20px' }} 
                />
                <Card.Body>
                  <Card.Title>{member.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{t(member.role)}</Card.Subtitle>
                  <div className="text-primary mt-2" style={{ fontSize: '0.9rem' }}>
                    {t('Click photo for info')}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Info Modal */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{activeMember?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <img 
              src={activeMember?.image} 
              alt={activeMember?.name} 
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', marginBottom: '20px' }}
            />
            <h5>{t(activeMember?.role)}</h5>
            <p className="mt-3">{t(activeMember?.description)}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t('Close')}
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </div>
  );
};

export default AboutScreen;
