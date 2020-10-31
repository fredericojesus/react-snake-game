import React, { useEffect, useState } from 'react';
import './Snake.css';
import { Cell } from '../models/snake.model';

interface Props {
  board: Cell[][];
  snakeSize: number;
  snakePositions: number[][];
}

const Snake: React.FC<Props> = (props: Props) => {
  const [snakePieces, setSnakePieces] = useState(<div></div>);
  useEffect(() => {
    if (props.snakePositions.length > 0) {
      setSnakePieces(
        <div
          className="snake"
          style={{
            width: props.snakeSize,
            height: props.snakeSize,
            top: `${props.snakePositions[0][1] * 20}px`,
            left: `${props.snakePositions[0][0] * 20}px`,
          }}
        ></div>,
      );
    }
  }, [props.snakePositions]);

  return snakePieces;
};

export default Snake;
