import { GamePhase, MoveDirection, SnakePosition } from './models/game.model';
import { GameAction, State } from './models/state.model';

export const recuder = (state: State, action: GameAction): State => {
  switch (action.type) {
    case GamePhase.INITIAL:
      return {
        ...state,
        board: action.board,
      };
    case GamePhase.START:
      return {
        ...state,
        gameState: GamePhase.START,
        isPlaying: true,
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
      };
    case GamePhase.TICK:
      if (state.isPlaying) {
        if (isGameOver({ ...state, direction: action.direction })) {
          return {
            ...state,
            gameState: GamePhase.GAME_OVER,
            isPlaying: false,
            direction: 'NOT_MOVING',
          };
        }

        // Change snake position after x ms
        return {
          ...state,
          gameState: GamePhase.TICK,
          isPlaying: true,
          snakePositions: calculateSnakePositions(state.snakePositions, action.direction),
          direction: action.direction,
        };
      }
      return state;
    default:
      return state;
  }
};

// Move
const calculateSnakePositions = (
  snakePositions: SnakePosition[],
  newDirection: MoveDirection,
): SnakePosition[] => {
  let snakeLastPosition = snakePositions[snakePositions.length - 1];

  for (let i = snakePositions.length - 1; i >= 0; i--) {
    const lastPosition = { ...snakePositions[i] };
    newDirection =
      i === snakePositions.length - 1
        ? newDirection
        : (snakeLastPosition.direction as MoveDirection);

    switch (newDirection) {
      case 'UP':
        snakePositions[i] = {
          x: snakeLastPosition.x,
          y: snakePositions[i].y - 1,
          direction: newDirection,
        };
        break;
      case 'DOWN':
        snakePositions[i] = {
          x: snakeLastPosition.x,
          y: snakePositions[i].y + 1,
          direction: newDirection,
        };
        break;
      case 'LEFT':
        snakePositions[i] = {
          x: snakePositions[i].x - 1,
          y: snakeLastPosition.y,
          direction: newDirection,
        };
        break;
      case 'RIGHT':
        snakePositions[i] = {
          x: snakePositions[i].x + 1,
          y: snakeLastPosition.y,
          direction: newDirection,
        };
        break;
    }

    snakeLastPosition = lastPosition;
  }

  return [...snakePositions];
};

// Check Walls
const isGameOver = ({ board, snakePositions, direction }: State): boolean => {
  const snakeLastPosition = snakePositions[snakePositions.length - 1];

  switch (direction) {
    case 'UP':
      if (snakeLastPosition.y === 0) {
        // hit ceiling
        return true;
      }
      break;
    case 'DOWN':
      if (snakeLastPosition.y === board[0].length - 1) {
        // hit floor
        return true;
      }
      break;
    case 'LEFT':
      if (snakeLastPosition.x === 0) {
        // hit left wall
        return true;
      }
      break;
    case 'RIGHT':
      if (snakeLastPosition.x === board[1].length - 1) {
        // hit right wall
        return true;
      }
      break;
  }

  return false;
};
