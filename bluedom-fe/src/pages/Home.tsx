import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { API_BASEURL, sendGetRequest } from '../Api';
import QuestItem, { Quest } from '../components/Quest';
import PlayerStats, { Player } from '../components/PlayerStats';
import { UserContext } from '../User';

const Home = () => {
  const userContext = useContext(UserContext);

  const [quests, setQuests] = useState<Quest[]>([]);

  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const fetchAllQuests = () => {
    sendGetRequest(`${API_BASEURL}/Quest`)
      .then((res) => res.json())
      .then(setQuests)
      .catch(console.log);
  };

  const fetchUserAssociatedPlayer = () => {
    sendGetRequest(`${API_BASEURL}/Player/${userContext.user.playerId}`)
      .then((res) => res.json())
      .then(setCurrentPlayer)
      .catch(console.log);
  };

  useEffect(fetchAllQuests, []);
  useEffect(fetchUserAssociatedPlayer, [userContext.user]);

  const navigate = useNavigate();

  const playQuest = (quest: Quest) => {
    navigate(`/quest/${quest.id}`);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Table variant="dark">
            <thead>
              <tr>
                <th>Name of quest</th>
                <th>Length of text</th>
                <th>Reward</th>
                <th>Required time to complete</th>
                <th>Issued by</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {quests.map((quest) => (
                <QuestItem key={quest.id} quest={quest} onAttempt={playQuest} />
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md="auto">
          {currentPlayer && <PlayerStats player={currentPlayer} />}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
