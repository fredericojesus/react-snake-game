import './Food.css';
import React, { useEffect, useState } from 'react';
import { State } from '../../models/state.model';

interface Props {
  state: State;
}

const Food: React.FC<Props> = (props: Props) => {
  const [food, setFood] = useState<JSX.Element>(<div></div>);

  useEffect(() => {
    if (props.state.foodPosition.length > 0) {
      setFood(
        <div
          className="food"
          style={{
            width: props.state.snakeSize,
            height: props.state.snakeSize,
            top: `${props.state.foodPosition[1] * props.state.snakeSize}px`,
            left: `${props.state.foodPosition[0] * props.state.snakeSize}px`,
          }}
        ></div>,
      );
    }
  }, [props.state.snakePositions, props.state.gameState]);

  return food;
};

export default Food;
