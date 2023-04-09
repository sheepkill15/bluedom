import React, { useState, useEffect, useContext } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { API_BASEURL, sendGetRequest } from '../Api';
import QuestItem, { Quest } from '../components/Quest';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PlayerStats, { Player } from '../components/PlayerStats';
import { UserContext } from '../User';
import Play from './Play';

const Home = () => {
  const userContext = useContext(UserContext);

  const [quests, setQuests] = useState<Quest[]>([]);

  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const [playingQuest, setPlayingQuest] = useState<Quest | null>(null);

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

  const finishQuest = (success: boolean, quest: Quest) => {
    setPlayingQuest(null);
  };

  useEffect(fetchAllQuests, []);
  useEffect(fetchUserAssociatedPlayer, [userContext.user]);

  return playingQuest ? (
    <Play onFinished={finishQuest} quest={playingQuest} />
  ) : (
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
                <QuestItem
                  key={quest.id}
                  quest={quest}
                  onAttempt={setPlayingQuest}
                />
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
