import React, { useState, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { API_BASEURL, sendGetRequest, sendPostRequest } from '../Api';
import { UserContext } from '../User';

export enum UnlockableTypes {
  BACKGROUND = 0,
  FONT = 1,
  EFFECT = 2,
}

export type Unlockable = {
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
  const [ownItems, setOwnItems] = useState<string[]>([]);

  const userContext = useContext(UserContext);

  const fetchAllShopItems = () => {
    sendGetRequest(`${API_BASEURL}/Unlockable`)
      .then((res) => res.json())
      .then(setShopItems)
      .catch(console.log);
  };

  const fetchOwnItems = () => {
    sendGetRequest(`${API_BASEURL}/Player/${userContext.user.playerId}`)
      .then((res) => res.json())
      .then((json) => setOwnItems(json['purchases'] ?? []))
      .catch(console.log);
  };

  useEffect(fetchAllShopItems, []);
  useEffect(fetchOwnItems, [userContext.user]);

  const buyItem = (item: Unlockable) => {
    sendPostRequest(
      `${API_BASEURL}/Unlockable/${item.id}`,
      {},
      { playerId: userContext.user.playerId }
    )
      .then((res) => res.json())
      .then((json) => setOwnItems([...ownItems, json['id']]))
      .catch(console.log);
  };

  return (
    <Container>
      <h2>Buy stuff here</h2>
      <Row>
        {shopItems.map((item) => (
          <Col key={item.id} md="auto">
            <Card bg="dark" text="white">
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>Type: {unlockableTypeToString[item.type]}</Card.Text>
                {ownItems.find((x) => x === item.id) ? (
                  <Button variant="success">Already bought</Button>
                ) : (
                  <Button variant="danger" onClick={() => buyItem(item)}>
                    Buy for {item.cost} tokens
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Shop;
