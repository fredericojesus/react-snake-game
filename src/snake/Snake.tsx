import './Snake.css';
import React, { useEffect, useState } from 'react';
import { State } from '../models/state.model';

interface Props {
  state: State;
}

const Snake: React.FC<Props> = (props: Props) => {
  const [snakePieces, setSnakePieces] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const pieces = props.state.snakePositions.map((snakePosition, index) => (
      <div
        key={index}
        className="snake"
        style={{
          width: props.state.snakeSize,
          height: props.state.snakeSize,
          top: `${snakePosition.y * props.state.snakeSize}px`,
          left: `${snakePosition.x * props.state.snakeSize}px`,
        }}
      ></div>
    ));
    setSnakePieces(pieces);
  }, [props.state.snakePositions]);

  return <>{snakePieces}</>;
};

export default Snake;
