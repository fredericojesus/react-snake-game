import './Panel.css';
import React, { Dispatch, useEffect, useState } from 'react';
import { GamePhase } from '../../models/game.model';
import { GameAction, State } from '../../models/state.model';

interface Props {
  state: State;
  dispatch: Dispatch<GameAction>;
}

const Panel: React.FC<Props> = (props: Props) => {
  const [title, setTitle] = useState('React Snake Game');
  const [action, setAction] = useState('Start');
  const [display, setDisplay] = useState('flex');

  useEffect(() => {
    switch (props.state.gameState) {
      case GamePhase.INITIAL:
        setTitle('React Snake Game');
        setAction('Start');
        break;
      case GamePhase.START:
        setDisplay('none');
        break;
      case GamePhase.TICK:
        break;
      default:
        setTitle('Game Over');
        setAction('Play again');
        setDisplay('flex');
        break;
    }
  }, [props.state.gameState]);

  const startGame = () => {
    props.dispatch({ type: GamePhase.START });
  };

  return (
    <div className="interface" style={{ display }}>
      <div>
        <h1>{title}</h1>
        <button onClick={startGame}>{action}</button>
      </div>
    </div>
  );
};

export default Panel;
