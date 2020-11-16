import './App.css';
import React, { useReducer } from 'react';
import Board from './components/board/Board';
import Panel from './components/panel/Panel';
import { GamePhase } from './models/game.model';
import { State } from './models/state.model';
import { recuder } from './reducer';

const App: React.FC = () => {
  const initialState: State = {
    gameState: GamePhase.INITIAL,
    isPlaying: false,
    snakeSize: 20,
    board: [],
    snakePositions: [{ y: 10, x: 10, direction: 'UP' }],
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
