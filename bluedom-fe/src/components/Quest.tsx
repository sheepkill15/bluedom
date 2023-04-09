import React from 'react';
import { Button } from 'react-bootstrap';

export type Quest = {
  id: string;
  name: string;
  text: string;
  issuerName: string;
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
  return (
    <tr>
      <td>{quest.name}</td>
      <td>{quest.text.length} characters</td>
      <td>{quest.reward} tokens</td>
      <td>{quest.requiredTime}s</td>
      <td>{quest.issuerName ? quest.issuerName : 'the house'}</td>
      <td>
        <Button variant="success" size="sm" onClick={() => onAttempt(quest)}>
          Attempt
        </Button>
      </td>
    </tr>
  );
};

export default QuestItem;
