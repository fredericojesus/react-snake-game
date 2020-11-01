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
  const [borderTopBottomWidth, setBorderTopBottomWidth] = useState(0);
  const [borderLeftRightWidth, setBorderLeftRightWidth] = useState(0);
  const [boardWidth, setBoardWidth] = useState(0);
  const [boardHeight, setBoardHeight] = useState(0);

  // Set board and border size
  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const verticalBorder = snakeSize + (windowHeight % snakeSize);
    const horizontalBorder = snakeSize + (windowWidth % snakeSize);

    setBorderTopBottomWidth(verticalBorder / 2);
    setBorderLeftRightWidth(horizontalBorder / 2);

    setBoardWidth(windowWidth - horizontalBorder);
    setBoardHeight(windowHeight - verticalBorder);
  }, []);

  // Create board matrix
  useEffect(() => {
    const numberOfVerticalCells = boardHeight / snakeSize;
    const numberOfHorizontalCells = boardWidth / snakeSize;

    setBoard([
      [...Array(numberOfVerticalCells).keys()].map(() => 'empty'),
      [...Array(numberOfHorizontalCells).keys()].map(() => 'empty'),
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
        if (snakeLastPosition[0] === 0) {
          // hit ceiling
        }
        setSnakePositions([
          ...snakePositions,
          [snakeLastPosition[0] - 1, snakeLastPosition[1]],
        ]);
        break;
      case 'ArrowDown':
        if (snakeLastPosition[0] === board[0].length - 1) {
          // hit floor
        }
        setSnakePositions([
          ...snakePositions,
          [snakeLastPosition[0] + 1, snakeLastPosition[1]],
        ]);
        break;
      case 'ArrowLeft':
        if (snakeLastPosition[1] === 0) {
          // hit left wall
        }
        setSnakePositions([
          ...snakePositions,
          [snakeLastPosition[0], snakeLastPosition[1] - 1],
        ]);
        break;
      case 'ArrowRight':
        if (snakeLastPosition[1] === board[1].length - 1) {
          // hit right wall
        }
        setSnakePositions([
          ...snakePositions,
          [snakeLastPosition[0], snakeLastPosition[1] + 1],
        ]);
        break;
    }

    // Snake speed
    const timer = setTimeout(() => forceMovingUpdate(), 100);
    return () => clearTimeout(timer);
  }, [snakeLastPosition]);

  console.log('test');

  return (
    <div
      className="board"
      style={{
        borderTopWidth: borderTopBottomWidth,
        borderBottomWidth: borderTopBottomWidth,
        borderLeftWidth: borderLeftRightWidth,
        borderRightWidth: borderLeftRightWidth,
        gridTemplateRows: `repeat(${boardHeight / snakeSize}, ${snakeSize}px)`,
        gridTemplateColumns: `repeat(${
          boardWidth / snakeSize
        }, ${snakeSize}px)`,
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
