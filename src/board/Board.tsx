import React, { useEffect, useRef, useState } from 'react';
import './Board.css';
import Snake from '../snake/Snake';

const Board: React.FC = () => {
  const boardEl = useRef<HTMLDivElement>(null);
  const [borderLeftRightWidth, setBorderLeftRightWidth] = useState(0);
  const [borderTopBottomWidth, setBorderTopBottomWidth] = useState(0);
  const [boardWidth, setBoardWidth] = useState(0);
  const [boardHeight, setBoardHeight] = useState(0);
  const snakeSize = 20;

  useEffect(() => {
    const windowWidth = boardEl.current?.clientWidth as number;
    const windowHeight = boardEl.current?.clientHeight as number;

    const horizontalBorder = snakeSize + (windowWidth % snakeSize);
    const verticalBorder = snakeSize + (windowHeight % snakeSize);

    setBorderLeftRightWidth(horizontalBorder / 2);
    setBorderTopBottomWidth(verticalBorder / 2);

    setBoardWidth(windowWidth - horizontalBorder);
    setBoardHeight(windowHeight - verticalBorder);
  }, [boardEl]);

  return (
    <div
      ref={boardEl}
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
    >
      <Snake snakeSize={snakeSize} />
    </div>
  );
};

export default Board;
