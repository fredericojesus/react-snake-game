import './App.css';
import React, { useReducer } from 'react';
import Board from './board/Board';
import { GamePhase } from './models/game.model';
import { State } from './models/state.model';
import Panel from './panel/Panel';
import { recuder } from './reducer';

const App: React.FC = () => {
  const initialState: State = {
    gameState: GamePhase.INITIAL,
    isPlaying: false,
    snakeSize: 20,
    board: [],
    snakePositions: [
      { y: 10, x: 10, direction: 'RIGHT' },
      { y: 10, x: 11, direction: 'RIGHT' },
      { y: 10, x: 12, direction: 'RIGHT' },
      { y: 10, x: 13, direction: 'RIGHT' },
      { y: 10, x: 14, direction: 'RIGHT' },
      { y: 10, x: 15, direction: 'RIGHT' },
      { y: 10, x: 16, direction: 'RIGHT' },
      { y: 10, x: 17, direction: 'RIGHT' },
      { y: 10, x: 18, direction: 'RIGHT' },
      { y: 10, x: 19, direction: 'RIGHT' },
      { y: 10, x: 20, direction: 'RIGHT' },
      { y: 10, x: 21, direction: 'RIGHT' },
    ],
    foodPosition: [],
    direction: 'NOT_MOVING',
  };

  const [state, dispatch] = useReducer(recuder, initialState);

  return (
    <div>
      <Board state={state} dispatch={dispatch} />
      <Panel state={state} dispatch={dispatch} />
    </div>
  );
};

export default App;
