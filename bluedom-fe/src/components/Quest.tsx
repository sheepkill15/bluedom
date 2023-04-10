import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { API_BASEURL, sendGetRequest } from '../Api';
import { UserContext } from '../User';

export type Quest = {
  id: string;
  name: string;
  text: string;
  issuerId: string;
  reward: number;
  requiredTime: number;
};

const QuestItem = ({
  quest,
  onAttempt,
}: {
  quest: Quest;
  onAttempt: (quest: Quest) => void;
}) => {
  const userContext = useContext(UserContext);

  const [issuer, setIssuer] = useState('');

  useEffect(() => {
    if (!quest.issuerId) {
      setIssuer('the house');
      return;
    }
    sendGetRequest(`${API_BASEURL}/Player/${quest.issuerId}`)
      .then((res) => res.json())
      .then((player) => setIssuer(player['name']))
      .catch(console.log);
  }, [quest]);

  return (
    <tr>
      <td>{quest.name}</td>
      <td>{quest.text.length} characters</td>
      <td>{quest.reward} tokens</td>
      <td>{quest.requiredTime}s</td>
      <td>{issuer}</td>
      <td>
        <Button
          disabled={quest.issuerId === userContext.user.playerId}
          variant="success"
          size="sm"
          onClick={() => onAttempt(quest)}
        >
          Attempt
        </Button>
      </td>
    </tr>
  );
};

export default QuestItem;
