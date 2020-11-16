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
      const foodPosition = generateNewFoodPosition(state.board) as number[];
      const board = state.board.map((xCell) => xCell.map(() => 'empty')) as Cell[][];
      board[foodPosition[0]][foodPosition[1]] = 'food';

      return {
        ...state,
        gameState: GamePhase.START,
        isPlaying: true,
        board,
        snakePositions: [{ y: 10, x: 10, direction: 'UP' }],
        foodPosition,
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

        const boardSnakeFoodPositions = calculateBoardSnakeFoodPositions(
          state.board,
          state.snakePositions,
          state.foodPosition,
          action.direction,
        );

        // Change snake position after x ms
        return {
          ...state,
          gameState: GamePhase.TICK,
          isPlaying: true,
          board: boardSnakeFoodPositions.board,
          snakePositions: boardSnakeFoodPositions.snakePositions,
          foodPosition: boardSnakeFoodPositions.foodPosition,
          direction: action.direction,
        };
      }
      return state;
    default:
      return state;
  }
};

const calculateBoardSnakeFoodPositions = (
  board: Cell[][],
  snakePositions: SnakePosition[],
  foodPosition: number[],
  newDirection: MoveDirection,
): { board: Cell[][]; snakePositions: SnakePosition[]; foodPosition: number[] } => {
  const snakeHeadPosition = snakePositions[snakePositions.length - 1];

  // Check if snake is going to eat, if yes, snake grows
  let isSnakeGoingToEat = false;
  switch (snakeHeadPosition.direction) {
    case 'UP':
      if (board[snakeHeadPosition.x][snakeHeadPosition.y - 1] === 'food') {
        isSnakeGoingToEat = true;
        snakePositions.unshift({
          x: snakePositions[0].x,
          y: snakePositions[0].y + 1,
          direction: 'UP',
        });
      }
      break;

    case 'DOWN':
      if (board[snakeHeadPosition.x][snakeHeadPosition.y + 1] === 'food') {
        isSnakeGoingToEat = true;
        snakePositions.unshift({
          x: snakePositions[0].x,
          y: snakePositions[0].y - 1,
          direction: 'DOWN',
        });
      }
      break;

    case 'LEFT':
      if (board[snakeHeadPosition.x - 1][snakeHeadPosition.y] === 'food') {
        isSnakeGoingToEat = true;
        snakePositions.unshift({
          x: snakePositions[0].x + 1,
          y: snakePositions[0].y,
          direction: 'LEFT',
        });
      }
      break;

    case 'RIGHT':
      if (board[snakeHeadPosition.x + 1][snakeHeadPosition.y] === 'food') {
        isSnakeGoingToEat = true;
        snakePositions.unshift({
          x: snakePositions[0].x - 1,
          y: snakePositions[0].y,
          direction: 'RIGHT',
        });
      }
      break;
  }

  // If snake is going to eat generate new food position
  if (isSnakeGoingToEat) {
    foodPosition = generateNewFoodPosition(board) as number[];
    board[foodPosition[0]][foodPosition[1]] = 'food';
  }

  // Move snake
  let snakeLastPosition = snakeHeadPosition;
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
    foodPosition,
  };
};

// Check walls and tale
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

const generateNewFoodPosition = (board: Cell[][]): number[] | void => {
  // Generate random positions
  let xPosition = Math.floor(Math.random() * board[0].length);
  let yPosition = Math.floor(Math.random() * board.length);

  // Check if cell is empty
  if (board[xPosition][yPosition] === 'empty') {
    return [xPosition, yPosition];
  }

  // Generate other random y position
  yPosition = Math.floor(Math.random() * board.length);

  // Check if cell is empty
  if (board[xPosition][yPosition] === 'empty') {
    return [xPosition, yPosition];
  }

  // Generate other random x position
  xPosition = Math.floor(Math.random() * board[0].length);

  // Check if cell is empty
  if (board[xPosition][yPosition] === 'empty') {
    return [xPosition, yPosition];
  }

  // Try again
  generateNewFoodPosition(board);
};
