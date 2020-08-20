import React, { useState } from "react";
import "./Board.css";

interface ObjLiteral {
  [key: number]: string;
}

export const Board = () => {
  const INITIAL_BOARD: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const [board, setBoard] = useState<number[][]>(INITIAL_BOARD);
  const [player, setPlayer] = useState<number>(1);
  const [winner, setWinner] = useState<string>("");

  const checkRowsWinner = () =>
    board.map((v) => v.filter((x) => x !== 0)).filter((x) => x.length === 3);

  const checkColumnsWinner = () =>
    board
      .map((_, i) =>
        board.reduce((a, v) => {
          if (v[i] !== 0) a.push(v[i]);
          return a;
        }, [])
      )
      .filter((x) => x.length === 3);

  const checkDiagonals = (type: string) => {
    const last = board.length - 1;
    const diagonalRightValues = board.reduce((a, _, i) => {
      if (type === "right" && board[i][i] !== 0) {
        a.push(board[i][i]);
      }
      if (type === "left" && board[i][last - i] !== 0) {
        a.push(board[i][last - i]);
      }
      return a;
    }, []);
    return diagonalRightValues;
  };

  const normalizeRowColumnWinner = (
    rowOrColumnFunction: Array<Array<number>>
  ) =>
    rowOrColumnFunction.map((x) =>
      x.every((v, _, arr) => v === arr[0]) ? x : []
    );

  const verifyDiagonalsWinner = (diagonal: Array<number>) =>
    diagonal.length === 3 && diagonal.every((v, _, arr) => v === arr[0]);

  // TODO: refactor in future...
  const verifyVictory = () => {
    const verifyRows = normalizeRowColumnWinner(checkRowsWinner());
    if (verifyRows.some((x) => x.length === 3)) {
      return verifyRows.find((x) => x.length === 3)?.[0];
    }

    const verifyColumns = normalizeRowColumnWinner(checkColumnsWinner());
    if (verifyColumns.some((x) => x.length === 3)) {
      return verifyColumns.find((x) => x.length === 3)?.[0];
    }

    const diagonalRight = checkDiagonals("right");
    if (verifyDiagonalsWinner(diagonalRight)) {
      return diagonalRight[0];
    }

    const diagonalLeft = checkDiagonals("left");
    if (verifyDiagonalsWinner(diagonalLeft)) {
      return diagonalLeft[0];
    }
  };

  const verifyDraw = () =>
    board.flatMap((b) => b.some((x) => x === 0)).every((x) => !x);

  const setBoardValue = (indexRow: number, indexColumn: number): void => {
    if (board[indexRow][indexColumn] === 0 && winner === "") {
      const newBoard = board;
      newBoard[indexRow][indexColumn] = player;
      setBoard(newBoard);
      setPlayer(player === 1 ? 2 : 1);
      const hasWinner = verifyVictory();
      if (hasWinner) {
        setWinner(`Player ${formatValue(hasWinner)} win!`);
        return;
      }
      if (verifyDraw()) {
        setWinner(`Draw!`);
      }
    }
  };

  const formatValue = (v: number): string => {
    const formats: ObjLiteral = {
      0: "",
      1: "X",
      2: "O",
    };
    return formats[v];
  };

  const retry = () => {
    setWinner("");
    setBoard(INITIAL_BOARD);
  };

  return (
    <>
      <div className="board">
        {board.map((row, indexRow) =>
          row.map((r, indexColumn) => (
            <div
              className="board-field"
              key={indexRow + indexColumn}
              onClick={() => setBoardValue(indexRow, indexColumn)}
            >
              {formatValue(r)}
            </div>
          ))
        )}
      </div>
      {winner !== "" ? (
        <>
          <h1>{winner}</h1>
          <button onClick={retry}>Retry!</button>
        </>
      ) : null}
    </>
  );
};
