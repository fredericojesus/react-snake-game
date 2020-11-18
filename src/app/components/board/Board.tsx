import './Board.css';
import React, { Dispatch, KeyboardEvent, useEffect, useState } from 'react';
import { GamePhase, MoveDirection } from '../../models/game.model';
import { GameAction, State } from '../../models/state.model';
import Food from '../food/Food';
import Snake from '../snake/Snake';

interface Props {
  state: State;
  dispatch: Dispatch<GameAction>;
}

const Board: React.FC<Props> = (props: Props) => {
  const snakeSize = 20;
  const [borderTopBottomWidth, setBorderTopBottomWidth] = useState(0);
  const [borderLeftRightWidth, setBorderLeftRightWidth] = useState(0);
  const [boardWidth, setBoardWidth] = useState(0);
  const [boardHeight, setBoardHeight] = useState(0);
  // Save all user inputs (gives a better UX)
  const [directions, setDirections] = useState<MoveDirection[]>([]);

  // Set board and border size
  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const verticalBorder = windowHeight % snakeSize;
    const horizontalBorder = windowWidth % snakeSize;

    setBorderTopBottomWidth(verticalBorder / 2);
    setBorderLeftRightWidth(horizontalBorder / 2);

    const newBoardHeight = windowHeight - verticalBorder;
    const newBoardWidth = windowWidth - horizontalBorder;
    setBoardHeight(newBoardHeight);
    setBoardWidth(newBoardWidth);

    const numberOfVerticalCells = newBoardHeight / snakeSize;
    const numberOfHorizontalCells = newBoardWidth / snakeSize;

    props.dispatch({
      type: GamePhase.INITIAL,
      board: Array.from(
        [...Array(numberOfHorizontalCells).keys()].map(() => 'empty'),
        () => [...Array(numberOfVerticalCells).keys()].map(() => 'empty'),
      ),
    });
  }, []);

  useEffect(() => {
    if (props.state.gameState === GamePhase.TICK) {
      const timer = setTimeout(() => {
        props.dispatch({
          type: GamePhase.TICK,
          direction: directions[0],
        });
      }, 100);

      // Don't remove the last user input (direction) or the snake would stop
      if (directions.length > 1) {
        setDirections(directions.slice(1));
      }
      return () => clearTimeout(timer);
    }
  }, [props.state.snakePositions]);

  // Listen to user key down events
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        const direction = directions[directions.length - 1];
        // e.g.: Transform 'ArrowDown' in 'DOWN'
        const newDirection = event.key
          .slice(event.key.indexOf('w') + 1)
          .toUpperCase() as MoveDirection;

        // If newDirection is different and not the opposite direction of current direction
        if (
          props.state.gameState === GamePhase.START ||
          (direction !== newDirection && !isOppositeDirection(direction, newDirection))
        ) {
          if (directions.length === 1) {
            setDirections([newDirection, newDirection]);
          } else {
            setDirections([...directions, newDirection]);
          }
        }

        // Start game
        if (props.state.gameState === GamePhase.START) {
          props.dispatch({
            type: GamePhase.TICK,
            direction: newDirection,
          });
        }
        break;
    }
  };

  return (
    <div
      id="board"
      className="board"
      style={{
        borderTopWidth: borderTopBottomWidth,
        borderBottomWidth: borderTopBottomWidth,
        borderLeftWidth: borderLeftRightWidth,
        borderRightWidth: borderLeftRightWidth,
        gridTemplateRows: `repeat(${boardHeight / snakeSize}, ${snakeSize}px)`,
        gridTemplateColumns: `repeat(${boardWidth / snakeSize}, ${snakeSize}px)`,
      }}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <Snake state={props.state} />
      <Food state={props.state} />
    </div>
  );
};

const isOppositeDirection = (
  currentDirection: MoveDirection,
  newDirection: MoveDirection,
): boolean => {
  switch (currentDirection) {
    case 'UP':
      if (newDirection === 'DOWN') {
        return true;
      }
      break;
    case 'DOWN':
      if (newDirection === 'UP') {
        return true;
      }
      break;
    case 'LEFT':
      if (newDirection === 'RIGHT') {
        return true;
      }
      break;
    case 'RIGHT':
      if (newDirection === 'LEFT') {
        return true;
      }
      break;
  }

  return false;
};

export default Board;
