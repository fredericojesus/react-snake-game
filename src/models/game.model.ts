export enum GamePhase {
  INITIAL,
  START,
  TICK,
  GAME_OVER,
}

export type Cell = 'empty' | 'snake' | 'food';

export type MoveDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NOT_MOVING';

export interface SnakePosition {
  x: number;
  y: number;
  direction?: MoveDirection;
}
