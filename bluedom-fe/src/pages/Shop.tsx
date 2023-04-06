import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { API_BASEURL, sendGetRequest } from '../Api';

enum UnlockableTypes {
  BACKGROUND = 0,
  FONT = 1,
  EFFECT = 2,
}

type Unlockable = {
  id: string;
  name: string;
  type: UnlockableTypes;
  description: string;
  data: string;
  cost: number;
};

const unlockableTypeToString = ['Background', 'Font', 'Effect'];

const Shop = () => {
  const [shopItems, setShopItems] = useState<Unlockable[]>([]);

  const fetchAllShopItems = () => {
    sendGetRequest(`${API_BASEURL}/Unlockable`)
      .then((res) => res.json())
      .then(setShopItems)
      .catch(console.log);
  };

  useEffect(fetchAllShopItems, []);

  return (
    <Container>
      <h2>Buy stuff here</h2>
      <Row>
        {shopItems.map((item) => (
          <Col key={item.name} md="auto">
            <Card bg="dark" text="white">
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>Type: {unlockableTypeToString[item.type]}</Card.Text>
                <Button variant="danger">Buy for {item.cost} tokens</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Shop;
