import React, { useContext, useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { UserContext } from '../User';
import { Player } from '../components/PlayerStats';
import { API_BASEURL, sendGetRequest } from '../Api';

const Leaderboards = () => {
  const userContext = useContext(UserContext);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);

  const [ownPosition, setOwnPosition] = useState(0);

  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    sendGetRequest(`${API_BASEURL}/Player/leaderboard`)
      .then((res) => res.json())
      .then(setTopPlayers)
      .catch(console.log);

    sendGetRequest(
      `${API_BASEURL}/Player/position/${userContext.user.playerId}`
    )
      .then((res) => res.json())
      .then(setOwnPosition)
      .catch(console.log);

    sendGetRequest(`${API_BASEURL}/Player/${userContext.user.playerId}`)
      .then((res) => res.json())
      .then(setCurrentPlayer)
      .catch(console.log);
  }, [userContext.user]);

  return (
    <Container>
      <h2>Leaderboards - top 10</h2>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Tokens</th>
            <th>Completed quests</th>
          </tr>
        </thead>
        <tbody>
          {topPlayers.map((player, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td
                style={{
                  color:
                    player.id === userContext.user.playerId
                      ? 'orange'
                      : 'white',
                }}
              >
                {player.name}
              </td>
              <td>{player.tokens}</td>
              <td>{player.quests}</td>
            </tr>
          ))}
          {!topPlayers.find((p) => p.id === userContext.user.playerId) && (
            <tr>
              <td>{ownPosition}</td>
              <td style={{ color: 'orange' }}>{currentPlayer?.name}</td>
              <td>{currentPlayer?.tokens}</td>
              <td>{currentPlayer?.quests}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Leaderboards;
