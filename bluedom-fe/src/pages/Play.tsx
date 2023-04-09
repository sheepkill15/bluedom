import React, { useState, useRef, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { API_BASEURL, sendGetRequest } from '../Api';
import { Player } from '../components/PlayerStats';
import { Quest } from '../components/Quest';

import '../styles/Play.css';
import { UserContext } from '../User';
import { Unlockable, UnlockableTypes } from './Shop';
import { Params, useLoaderData } from 'react-router-dom';

const SPACE_CODE = 'Space';
const BACKSPACE_CODE = 'Backspace';

type Selection = {
  background: string;
  font: string;
  effect: string;
};

const TypeRacer = ({
  quest,
  onFinished,
}: {
  quest: Quest;
  onFinished: () => void;
}) => {
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
  const typedTextRef = useRef<HTMLSpanElement>(null);

  const [typedText, setTypedText] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === quest.text) {
      onFinished();
    }

    setTypedText(e.target.value);

    if (!hiddenInputRef.current) {
      return;
    }

    const inputPosition = hiddenInputRef.current.getBoundingClientRect().top;

    window.scrollTo({
      behavior: 'smooth',
      top: window.scrollY + inputPosition - window.innerHeight / 2,
    });
  };

  const handleSingleSpace = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code !== BACKSPACE_CODE && typedText.length >= quest.text.length) {
      e.preventDefault();
    }
    if (e.code === SPACE_CODE) {
      if (typedText.charAt(typedText.length - 1) === ' ') {
        e.preventDefault();
      }
    }
  };

  const focusHiddenInput = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus({ preventScroll: true });
    }
  };

  useEffect(focusHiddenInput, []);

  return (
    <Container onClick={focusHiddenInput}>
      <span ref={typedTextRef} className="quest-text">
        {typedText}
      </span>
      <textarea
        ref={hiddenInputRef}
        onKeyDown={handleSingleSpace}
        onChange={handleInput}
        className="hidden-input"
      />
      <span className="quest-placeholder">
        {quest.text.substring(typedText.length)}
      </span>
    </Container>
  );
};

const QuestSetup = ({
  onStart,
}: {
  onStart: (selection: Selection) => void;
}) => {
  const userContext = useContext(UserContext);

  const [unlockables, setUnlockables] = useState<Unlockable[]>([]);

  const [selections, setSelections] = useState<Selection>({
    background: '',
    font: '',
    effect: '',
  });

  useEffect(() => {
    const fetchPlayerUnlockables = async () => {
      const response = await sendGetRequest(
        `${API_BASEURL}/Player/${userContext.user.playerId}`
      );
      const player = (await response.json()) as Player;

      const fetches: Promise<Unlockable>[] = [];
      for (const unlockable of player.purchases ?? []) {
        fetches.push(
          sendGetRequest(`${API_BASEURL}/Unlockable/${unlockable}`).then(
            (res) => res.json()
          )
        );
      }

      const all = await Promise.all(fetches);
      setUnlockables(all);
    };

    fetchPlayerUnlockables();
  }, [userContext.user]);

  const getOptionUnlockablesOfType = (type: UnlockableTypes) =>
    unlockables
      .filter((x) => x.type === type)
      .map((bg) => (
        <option key={bg.id} value={bg.data}>
          {bg.name}
        </option>
      ));

  const handleSelectChanged = (
    type: 'background' | 'font' | 'effect',
    value: string
  ) => {
    setSelections({ ...selections, [type]: value });
  };

  const selectTypes = ['background', 'font', 'effect'] as const;

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Form
        onSubmit={(e: { preventDefault: () => void }) => {
          e.preventDefault();
          onStart(selections);
        }}
      >
        {selectTypes.map((type, i) => (
          <Form.Group
            key={i}
            style={{ marginTop: '2rem' }}
            controlId={`select${type}`}
          >
            <Form.Label>Choose a {type}</Form.Label>
            <Form.Select
              onChange={(e) => handleSelectChanged(type, e.target.value)}
            >
              <option>Default {type}</option>
              {getOptionUnlockablesOfType(i)}
            </Form.Select>
          </Form.Group>
        ))}
        <Button style={{ marginTop: '2rem' }} variant="success" type="submit">
          Start the quest
        </Button>
      </Form>
    </Container>
  );
};

const QuestResults = ({
  success,
  onContinue,
}: {
  success: boolean;
  onContinue: (success: boolean) => void;
}) => {
  return (
    <Container style={{ textAlign: 'center', marginTop: '2rem' }}>
      {success ? (
        <h2>Congratulations, you've completed the quest!</h2>
      ) : (
        <h2>Sorry, you didn't quite get it this time.</h2>
      )}
      <Button
        onClick={() => onContinue(success)}
        variant={success ? 'success' : 'danger'}
      >
        {success ? 'Claim rewards' : 'Go back home'}
      </Button>
    </Container>
  );
};

export async function questLoader({ params }: { params: Params }) {
  const quest = (await sendGetRequest(`${API_BASEURL}/Quest/${params.questId}`)
    .then((res) => res.json())
    .catch(console.log)) as Quest;
  return { quest };
}

const Play = () => {
  const { quest } = useLoaderData() as { quest: Quest | null };

  const [remainingTime, setRemainingTime] = useState(quest?.requiredTime ?? 0);

  const [started, setStarted] = useState(false);

  const [finished, setFinished] = useState<boolean | null>(null);

  const handleStart = (selection: Selection) => {
    setStarted(true);
  };

  const onQuestFinished = (success: boolean) => {};

  useEffect(() => {
    let updateSeconds: NodeJS.Timer | null = null;
    if (started) {
      updateSeconds = setInterval(() => {
        if (finished !== null) {
          if (updateSeconds) {
            clearInterval(updateSeconds);
            return;
          }
        }
        if (remainingTime <= 0) {
          setFinished(false);
        }
        setRemainingTime((time) => {
          return time - 1;
        });
      }, 1000);
    }
    return () => {
      if (updateSeconds) {
        clearInterval(updateSeconds);
      }
    };
  }, [started, remainingTime]);

  if (!quest) {
    return (
      <Container>
        <h2>This quest was not found.</h2>
      </Container>
    );
  }

  return (
    <Container style={{ position: 'relative' }}>
      <div className="quest-top-bar">
        <h2>{quest.name}</h2>
        <b>Remaining time: {remainingTime} seconds</b>
      </div>
      {finished !== null ? (
        <QuestResults onContinue={onQuestFinished} success={finished} />
      ) : started ? (
        <TypeRacer onFinished={() => setFinished(true)} quest={quest} />
      ) : (
        <QuestSetup onStart={handleStart} />
      )}
    </Container>
  );
};

export default Play;
