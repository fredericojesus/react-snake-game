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
      board: [
        [...Array(numberOfVerticalCells).keys()].map(() => 'empty'),
        [...Array(numberOfHorizontalCells).keys()].map(() => 'empty'),
      ],
    });
  }, []);

  useEffect(() => {
    if (props.state.gameState === GamePhase.TICK) {
      switch (props.state.gameState) {
        case GamePhase.TICK:
          const timer = setTimeout(() => {
            props.dispatch({
              type: GamePhase.TICK,
              direction: props.state.direction,
            });
          }, 100);
          return () => clearTimeout(timer);
      }
    }
  }, [props.state.snakePositions]);

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
    if (direction !== newDirection) {
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

export default Board;
