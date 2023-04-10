import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { API_BASEURL, sendGetRequest } from '../Api';

export type Player = {
  id: string;
  name: string;
  quests: number;
  tokens: number;
  badges: string[];
  purchases: string[];
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  requiredTokens: number;
  requiredQuests: number;
};

const BadgeDisplay = ({ badge }: { badge: Badge }) => {
  return (
    <div className="ms-2 me-auto">
      <div className="fw-bold">{badge.name}</div>
      {badge.description}
    </div>
  );
};

const PlayerStats = ({ player }: { player: Player }) => {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const fetches: Promise<Badge>[] = [];
    for (const badge of player.badges ?? []) {
      const fetchBadge = sendGetRequest(`${API_BASEURL}/Badge/${badge}`).then(
        (res) => res.json()
      );
      fetches.push(fetchBadge);
    }

    Promise.all(fetches).then(setBadges);
  }, [player]);

  return (
    <Card bg="dark" text="white">
      <Card.Body>
        <Card.Title>{player.name}</Card.Title>
        <Card.Text>{player.tokens} tokens</Card.Text>
        <Card.Text>{player.quests} quests completed</Card.Text>
        <Card.Text>{badges.length} badges acquired:</Card.Text>
        <ListGroup variant="flush" as="ol" numbered>
          {badges.map((badge) => (
            <ListGroup.Item
              variant="success"
              key={badge.id}
              style={{ backgroundColor: 'unset', color: 'white' }}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <BadgeDisplay badge={badge} />
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card.Text>{player.purchases?.length ?? 0} purchases</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PlayerStats;
