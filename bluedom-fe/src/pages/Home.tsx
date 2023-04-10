import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { API_BASEURL, sendGetRequest, sendPostRequest } from '../Api';
import QuestItem, { Quest } from '../components/Quest';
import PlayerStats, { Player } from '../components/PlayerStats';
import { UserContext } from '../User';
import { Button } from 'react-bootstrap';
import AutoForm, { FormInput } from '../components/Form';

const questInputs: FormInput[] = [
  {
    name: 'name',
    placeholder: 'Name',
    type: 'text',
  },
  {
    name: 'text',
    placeholder: 'Quest text',
    type: 'text',
  },
  {
    name: 'reward',
    placeholder: 'Quest reward (in tokens)',
    type: 'number',
  },
  {
    name: 'requiredTime',
    placeholder: 'Required time to solve (in seconds)',
    type: 'number',
  },
];

const QuestCreation = ({ onCreate }: { onCreate: (quest: Quest) => void }) => {
  const userContext = useContext(UserContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let questData = {};
  const onChangeQuestData = (data: any) => (questData = data);

  const handleCreateQuest = () => {
    sendPostRequest(`${API_BASEURL}/Quest`, {
      ...questData,
      issuerId: userContext.user.playerId,
    })
      .then((res) => res.json())
      .then(onCreate)
      .catch(console.log);
    setShow(false);
  };

  return (
    <>
      <Button
        onClick={handleShow}
        style={{ padding: '0.2rem' }}
        variant="primary"
      >
        Create
      </Button>

      <Modal style={{ color: 'black' }} show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create quest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please supply the neccessary information to create a quest.
          <AutoForm inputs={questInputs} onChange={onChangeQuestData} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateQuest}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

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

  const onCreateQuest = (quest: Quest) => {
    setQuests([...quests, quest]);
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
                <th>
                  <QuestCreation onCreate={onCreateQuest} />
                </th>
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
