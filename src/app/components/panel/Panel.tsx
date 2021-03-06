import './Panel.css';
import React, { Dispatch, KeyboardEvent, useEffect, useState } from 'react';
import { GamePhase } from '../../models/game.model';
import { GameAction, State } from '../../models/state.model';

interface Props {
  state: State;
  dispatch: Dispatch<GameAction>;
}

const Panel: React.FC<Props> = (props: Props) => {
  const [title, setTitle] = useState('React Snake Game');
  const [action, setAction] = useState('Start');
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    document.getElementById('btnStart')?.focus();
  }, []);

  useEffect(() => {
    switch (props.state.gameState) {
      case GamePhase.INITIAL:
        setTitle('React Snake Game');
        setAction('Start');
        break;
      case GamePhase.START:
        setOpacity(0);
        break;
      case GamePhase.TICK:
        break;
      default:
        setTitle('Game Over');
        setAction('Play again');
        setOpacity(1);
        document.getElementById('btnStart')?.focus();
        break;
    }
  }, [props.state.gameState]);

  // Listen to user key down events
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        startGame();
        break;
    }
  };

  const startGame = () => {
    props.dispatch({ type: GamePhase.START });
    document.getElementById('board')?.focus();
  };

  return (
    <div className="panel" style={{ opacity: opacity }} onKeyDown={onKeyDown} tabIndex={0}>
      <div>
        <h1>{title}</h1>
        <button id="btnStart" onClick={startGame}>
          {action}
        </button>
      </div>
    </div>
  );
};

export default Panel;
