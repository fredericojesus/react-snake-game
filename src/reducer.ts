import { Cell, GamePhase, MoveDirection, SnakePosition } from './models/game.model';
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
        board: state.board.map((xCell) => xCell.map(() => 'empty')),
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

        const boardAndSnakePositions = calculateBoardAndSnakePositions(
          state.board,
          state.snakePositions,
          action.direction,
        );

        // Change snake position after x ms
        return {
          ...state,
          gameState: GamePhase.TICK,
          isPlaying: true,
          board: boardAndSnakePositions.board,
          snakePositions: boardAndSnakePositions.snakePositions,
          direction: action.direction,
        };
      }
      return state;
    default:
      return state;
  }
};

// Move
const calculateBoardAndSnakePositions = (
  board: Cell[][],
  snakePositions: SnakePosition[],
  newDirection: MoveDirection,
): { board: Cell[][]; snakePositions: SnakePosition[] } => {
  let snakeLastPosition = snakePositions[snakePositions.length - 1];

  for (let i = snakePositions.length - 1; i >= 0; i--) {
    const lastPosition = { ...snakePositions[i] };
    board[snakePositions[i].x][snakePositions[i].y] = 'empty';

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
    board[snakePositions[i].x][snakePositions[i].y] = 'snake';
  }

  return {
    board: [...board],
    snakePositions: [...snakePositions],
  };
};

// Check Walls
const isGameOver = ({ board, snakePositions, direction }: State): boolean => {
  const snakeHeadPosition = snakePositions[snakePositions.length - 1];

  switch (direction) {
    case 'UP':
      // hit ceiling or hit tale
      if (
        snakeHeadPosition.y === 0 ||
        board[snakeHeadPosition.x][snakeHeadPosition.y - 1] === 'snake'
      ) {
        return true;
      }
      break;
    case 'DOWN':
      // hit floor or hit tale
      if (
        snakeHeadPosition.y === board[0].length - 1 ||
        board[snakeHeadPosition.x][snakeHeadPosition.y + 1] === 'snake'
      ) {
        return true;
      }
      break;
    case 'LEFT':
      // hit left wall or hit tale
      if (
        snakeHeadPosition.x === 0 ||
        board[snakeHeadPosition.x - 1][snakeHeadPosition.y] === 'snake'
      ) {
        return true;
      }
      break;
    case 'RIGHT':
      // hit right wall or hit tale
      if (
        snakeHeadPosition.x === board[1].length - 1 ||
        board[snakeHeadPosition.x + 1][snakeHeadPosition.y] === 'snake'
      ) {
        return true;
      }
      break;
  }

  return false;
};
