import './Snake.css';
import React, { Dispatch } from 'react';
import { GameAction, State } from '../models/state.model';

interface Props {
  state: State;
  dispatch: Dispatch<GameAction>;
}

const Food: React.FC<Props> = (props: Props) => {
  return (
    <div
      className="food"
      style={{
        width: props.state.snakeSize,
        height: props.state.snakeSize,
        top: `${props.state.foodPosition[0] * props.state.snakeSize}px`,
        left: `${props.state.foodPosition[1] * props.state.snakeSize}px`,
      }}
    ></div>
  );
};

export default Food;
