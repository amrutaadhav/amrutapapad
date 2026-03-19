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
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <h1 className="text-center mb-5 brand-title">{t('About Amruta Papad')}</h1>

      <Row className="mb-5 text-center">
        <Col md={8} className="mx-auto">
          <p className="lead">
            {t('Amruta Papad was founded with a single vision: to bring authentic, home-style traditional recipes back to modern dining tables. Our papads are still rolled and dried using authentic methods without any artificial preservatives.')}
          </p>
        </Col>
      </Row>

      <h2 className="text-center mb-4">{t('Meet Our Team')}</h2>
      <Row className="justify-content-center">
        {teamMembers.map((member) => (
          <Col key={member.id} xs={12} sm={6} md={4} className="mb-4">
            <Card 
              className="border-0 shadow-sm shadow-hover text-center h-100" 
              style={{ cursor: 'pointer' }}
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
  );
};

export default AboutScreen;
