import React, { useEffect, useState } from "react";

// styles
import styles from "./App.module.scss";

// types
export interface ISquareProps {
  isQuestioned: boolean;
  isFlagged: boolean;
  isOpen: boolean;
  isMine: boolean;
  number: IPossibleNumber;
}

export type IPossibleNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type IDimensions = [number, number];
export type ICoord = [number, number];
export type ICoordList = [number, number][];
export type IBoard = ISquareProps[][];

// helpers
const getRandomInt = (ceiling: number) => Math.floor(Math.random() * ceiling);

const getRandomCoord = (dim: IDimensions): ICoord => [
  getRandomInt(dim[0]),
  getRandomInt(dim[1])
];

const doesListContainCoord = (list: ICoordList, coord: ICoord): boolean => {
  return list.some(m => m[0] === coord[0] && m[1] === coord[1]);
};

const generateMineCoords = (
  dimensions: IDimensions,
  mineCount: number
): ICoordList => {
  const result: ICoordList = [];

  // Add mines until we hit the desired mineCount
  while (result.length < mineCount) {
    const candidate = getRandomCoord(dimensions);
    if (!doesListContainCoord(result, candidate)) {
      result.push(candidate);
    }
  }

  return result;
};

const assignMines = (dims: IDimensions, mineCount: number): IBoard => {
  const board: IBoard = Array(dims[0])
    .fill(undefined)
    .map(f =>
      Array(dims[1])
        .fill(undefined)
        .map(e => ({
          isQuestioned: false,
          isFlagged: false,
          isOpen: false,
          isMine: false,
          number: 0
        }))
    );

  const mineCoords = generateMineCoords(dims, mineCount);

  mineCoords.forEach(mineCoord => {
    board[mineCoord[0]][mineCoord[1]].isMine = true;
    getAdjacentCoordList(mineCoord, dims).forEach(adj => {
      board[adj[0]][adj[1]].number++;
    });
  });

  return board;
};

const getAdjacentCoordList = (
  coord: ICoord,
  dimensions: IDimensions
): ICoordList => {
  const adjacentCoords: ICoordList = [];
  const [rowCoord, colCoord] = coord;

  if (rowCoord) {
    adjacentCoords.push([rowCoord - 1, colCoord]);
    if (colCoord) {
      adjacentCoords.push([rowCoord - 1, colCoord - 1]);
    }
    if (colCoord + 1 < dimensions[1]) {
      adjacentCoords.push([rowCoord - 1, colCoord + 1]);
    }
  }

  if (colCoord) {
    adjacentCoords.push([rowCoord, colCoord - 1]);
  }
  if (colCoord + 1 < dimensions[1]) {
    adjacentCoords.push([rowCoord, colCoord + 1]);
  }

  if (rowCoord + 1 < dimensions[0]) {
    adjacentCoords.push([rowCoord + 1, colCoord]);
    if (colCoord) {
      adjacentCoords.push([rowCoord + 1, colCoord - 1]);
    }
    if (colCoord + 1 < dimensions[1]) {
      adjacentCoords.push([rowCoord + 1, colCoord + 1]);
    }
  }

  return adjacentCoords;
};

const Square = (props: ISquareProps) => {
  const { isMine, isFlagged, isOpen, isQuestioned, number } = props;

  let content = "";
  if (isOpen) {
    content = isMine ? "*" : number.toString();
  } else {
    content = isFlagged ? "F" : isQuestioned ? "?" : "";
  }

  return <td className={styles.square}>{content}</td>;
};

// primary component
export const App: React.FC = () => {
  const [dimensions] = useState<IDimensions>([15, 20]);
  const [mineCount] = useState(60);
  const [board, setBoard] = useState<IBoard>([]);

  // Create Initial Game State
  useEffect(() => {
    setBoard(assignMines(dimensions, mineCount));
  }, [dimensions, mineCount]);

  return (
    <div>
      <table className={styles.table}>
        <tbody>
          {board.map((row, i) => (
            <tr key={`row ${i}`}>
              {board[i].map((square, j) => (
                <Square {...square} key={`row ${i}, col ${j}`} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
