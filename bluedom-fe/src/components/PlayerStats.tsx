import React from 'react';
import Card from 'react-bootstrap/Card';

export type Player = {
  id: string;
  name: string;
  quests: number;
  tokens: number;
  badges: string[];
  purchases: string[];
};

const PlayerStats = ({ player }: { player: Player }) => {
  return (
    <Card bg="dark" text="white">
      <Card.Body>
        <Card.Title>{player.name}</Card.Title>
        <Card.Text>{player.tokens} tokens</Card.Text>
        <Card.Text>{player.quests} quests completed</Card.Text>
        <Card.Text>{player.badges?.length ?? 0} badges acquired</Card.Text>
        <Card.Text>{player.purchases?.length ?? 0} purchases</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PlayerStats;
