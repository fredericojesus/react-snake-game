import React from 'react';
import './Snake.css';

interface Props {
  foodSize: number;
  foodPosition: number[];
}

const Food: React.FC<Props> = (props: Props) => {
  return (
    <div
      className="food"
      style={{
        width: props.foodSize,
        height: props.foodSize,
        top: `${props.foodPosition[0] * props.foodSize}px`,
        left: `${props.foodPosition[1] * props.foodSize}px`,
      }}
    ></div>
  );
};

export default Food;
