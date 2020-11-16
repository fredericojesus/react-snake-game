import './Board.css';
import React, { Dispatch, KeyboardEvent, useEffect, useState } from 'react';
import { GamePhase, MoveDirection } from '../models/game.model';
import { GameAction, State } from '../models/state.model';
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
  const [direction, setDirection] = useState<MoveDirection>('NOT_MOVING');

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
    switch (props.state.gameState) {
      case GamePhase.TICK:
        const timer = setTimeout(() => {
          props.dispatch({
            type: GamePhase.TICK,
            direction: props.state.direction,
          });
        }, 100);
        return () => clearTimeout(timer);
      case GamePhase.GAME_OVER:
        setDirection('NOT_MOVING');
        break;
    }
  }, [props.state.snakePositions, props.state.gameState]);

  useEffect(() => {
    if (direction !== 'NOT_MOVING') {
      setTimeout(() => {
        props.dispatch({
          type: GamePhase.TICK,
          direction: direction,
        });
      }, 100);
    }
  }, [direction]);

  // Listen to user key down events
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // e.g.: Transform 'ArrowDown' in 'DOWN'
    const newDirection = event.key.slice(event.key.indexOf('w') + 1).toUpperCase() as MoveDirection;

    // If newDirection is different and not the opposite direction of current direction
    if (direction !== newDirection && !isOppositeDirection(direction, newDirection)) {
      setDirection(event.key.slice(event.key.indexOf('w') + 1).toUpperCase() as MoveDirection);
    }
  };

  return (
    <div
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
