import React, { KeyboardEvent, useEffect, useReducer, useState } from 'react';
import './Board.css';
import { Cell } from '../models/snake.model';
import Snake from '../snake/Snake';

type Move = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'NotMoving';

const Board: React.FC = () => {
  const snakeSize = 20;
  const [board, setBoard] = useState<Cell[][]>([]);
  const [snakePositions, setSnakePositions] = useState([[10, 10]]);
  const [snakeLastPosition, setSnakeLastPosition] = useState([10, 10]);
  const [moving, setMoving] = useState<Move>('NotMoving');
  const [forceMoving, forceMovingUpdate] = useReducer((x) => x + 1, 0);
  const [borderLeftRightWidth, setBorderLeftRightWidth] = useState(0);
  const [borderTopBottomWidth, setBorderTopBottomWidth] = useState(0);
  const [boardWidth, setBoardWidth] = useState(0);
  const [boardHeight, setBoardHeight] = useState(0);

  // Set board and border size
  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const horizontalBorder = snakeSize + (windowWidth % snakeSize);
    const verticalBorder = snakeSize + (windowHeight % snakeSize);

    setBorderLeftRightWidth(horizontalBorder / 2);
    setBorderTopBottomWidth(verticalBorder / 2);

    setBoardWidth(windowWidth - horizontalBorder);
    setBoardHeight(windowHeight - verticalBorder);
  }, []);

  // Create board matrix
  useEffect(() => {
    const numberOfHorizontalCells = boardWidth / snakeSize;
    const numberOfVerticalCells = boardHeight / snakeSize;

    setBoard([
      [...Array(numberOfHorizontalCells).keys()].map(() => 'empty'),
      [...Array(numberOfVerticalCells).keys()].map(() => 'empty'),
    ]);
  }, [boardWidth, boardHeight]);

  // Listen to user key down events
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        setMoving(event.key);
        break;
    }
  };

  // Move
  useEffect(() => {
    if (moving !== 'NotMoving') {
      setSnakeLastPosition(snakePositions[snakePositions.length - 1]);
      setSnakePositions(snakePositions.slice(0, snakePositions.length - 1));
    }
  }, [moving, forceMoving]);

  // Change snake position
  useEffect(() => {
    switch (moving) {
      case 'ArrowUp':
        setSnakePositions([
          ...snakePositions,
          [snakeLastPosition[0], snakeLastPosition[1] - 1],
        ]);
        break;
      case 'ArrowDown':
        setSnakePositions([
          ...snakePositions,
          [snakeLastPosition[0], snakeLastPosition[1] + 1],
        ]);
        break;
      case 'ArrowLeft':
        setSnakePositions([
          ...snakePositions,
          [snakeLastPosition[0] - 1, snakeLastPosition[1]],
        ]);
        break;
      case 'ArrowRight':
        setSnakePositions([
          ...snakePositions,
          [snakeLastPosition[0] + 1, snakeLastPosition[1]],
        ]);
        break;
    }

    // Snake speed
    const timer = setTimeout(() => forceMovingUpdate(), 100);
    return () => clearTimeout(timer);
  }, [snakeLastPosition]);

  return (
    <div
      className="board"
      style={{
        borderTopWidth: borderTopBottomWidth,
        borderBottomWidth: borderTopBottomWidth,
        borderLeftWidth: borderLeftRightWidth,
        borderRightWidth: borderLeftRightWidth,
        gridTemplateColumns: `repeat(${
          boardWidth / snakeSize
        }, ${snakeSize}px)`,
        gridTemplateRows: `repeat(${boardHeight / snakeSize}, ${snakeSize}px)`,
      }}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <Snake
        board={board}
        snakeSize={snakeSize}
        snakePositions={snakePositions}
      />
    </div>
  );
};

export default Board;
