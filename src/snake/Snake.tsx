import React from 'react';
import './Snake.css';

interface Props {
  snakeSize: number;
}

const Snake: React.FC<Props> = (props: Props) => {
  return (
    <div
      className="snake"
      style={{
        width: props.snakeSize,
        height: props.snakeSize,
      }}
    ></div>
  );
};

export default Snake;
