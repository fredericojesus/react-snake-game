import { Cell, GamePhase, MoveDirection, SnakePosition } from './game.model';

export interface State {
  gameState: GamePhase;
  isPlaying: boolean;
  snakeSize: number;
  board: Cell[][];
  snakePositions: SnakePosition[];
  foodPosition: number[];
  direction: MoveDirection;
}

export interface InitialAction {
  type: GamePhase.INITIAL;
  board: Cell[][];
}

export interface StartAction {
  type: GamePhase.START;
}

export interface TickAction {
  type: GamePhase.TICK;
  direction: MoveDirection;
}

export type GameAction = InitialAction | StartAction | TickAction;
