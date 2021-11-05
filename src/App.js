import React, { useState } from "react";
import "./App.css";
import {
    squareNum,
    directionsArray,
    squareAllNum,
    defaultPieceSet,
    COLUMN,
} from "./constData.js";

// column = |||, row = 三
// class App extends .. でもできる。その場合constructorやthis.stateといった感じでobujectを定義する形になる
function App() {
    let [count, setCount] = useState(0);
    const [pieceSet, setPieceSet] = useState({ ...defaultPieceSet });
    const [isNextPlayerBlack, setNextPlayerBlack] = useState(true);
    const [winnerColor, setwinnerColor] = useState(null);

    const squareClickHandlar = (column, row) => {
        if (!checkAbleToPutDisk(column, row)) {
            return;
        }

        let newPieceSet, colName;
        if (isNextPlayerBlack) {
            colName = COLUMN.BLACK;
            newPieceSet = pieceSet.blackCol;
        } else {
            colName = COLUMN.WHITE;
            newPieceSet = pieceSet.whiteCol;
        }

        if (newPieceSet[column]) {
            newPieceSet[column].push(row);
        } else {
            newPieceSet[column] = [row];
        }
        setPieceSet({ ...pieceSet, [colName]: newPieceSet });
        changePlayer();

        setCount(count + 1);
        checkFinish();
    };

    const checkAbleToPutDisk = (column, row) => {
        if (isItAlreadyPlacedSquares(column, row)) {
            alert("すでに置かれたマスです");
            return false;
        }

        for (let i = 0; i < directionsArray.length; i++) {
            if (
                checkPossibilityToTurnOverOneDirection(
                    column,
                    row,
                    directionsArray[i],
                    0
                )
            ) {
                putDisk(column, row);
                return true;
            }
        }
        return false;
    };

    const isItAlreadyPlacedSquares = (column, row) => {
        return (
            pieceSet.whiteCol[column]?.indexOf(row) > -1 ||
            pieceSet.blackCol[column]?.indexOf(row) > -1
        );
    };

    const checkPossibilityToTurnOverOneDirection = (
        column,
        row,
        incrementArray,
        index
    ) => {
        const PlayerDiskSet = isNextPlayerBlack ? COLUMN.BLACK : COLUMN.WHITE;
        const OpponentPlayerDiskSet = !isNextPlayerBlack
            ? COLUMN.BLACK
            : COLUMN.WHITE;

        const incrementedColumn = column + incrementArray[0];
        const incrementedRow = row + incrementArray[1];

        if (
            foundOpponentDisk(
                OpponentPlayerDiskSet,
                incrementedColumn,
                incrementedRow
            )
        ) {
            return checkPossibilityToTurnOverOneDirection(
                incrementedColumn,
                incrementedRow,
                incrementArray,
                index + 1
            );
        }

        // 最終的に自分のコマがあるかチェック
        return foundMyDisk(
            index,
            PlayerDiskSet,
            incrementedColumn,
            incrementedRow
        );
    };

    const foundOpponentDisk = (
        OpponentPlayerDiskSet,
        incrementedColumn,
        incrementedRow
    ) => {
        return (
            pieceSet[OpponentPlayerDiskSet][incrementedColumn]?.indexOf(
                incrementedRow
            ) > -1
        );
    };

    const foundMyDisk = (
        index,
        PlayerDiskSet,
        incrementedColumn,
        incrementedRow
    ) => {
        return (
            index > 0 &&
            pieceSet[PlayerDiskSet][incrementedColumn]?.indexOf(
                incrementedRow
            ) > -1
        );
    };

    const turnOverDisk = (column, row, incrementArray) => {
        const PlayerDiskSet = isNextPlayerBlack ? COLUMN.BLACK : COLUMN.WHITE;
        const OpponentPlayerDiskSet = !isNextPlayerBlack
            ? COLUMN.BLACK
            : COLUMN.WHITE;

        // ERROR: 一個以上ひっくり返すときに一個しかひっくり返らない -> SOLVE: whileして繰り返す
        let incrementedColumn = column + incrementArray[0];
        let incrementedRow = row + incrementArray[1];
        let newPieceSet = pieceSet;

        while (
            pieceSet[OpponentPlayerDiskSet][incrementedColumn]?.indexOf(
                incrementedRow
            ) > -1
        ) {
            // 自分の増える持ちコマ
            if (newPieceSet[PlayerDiskSet][incrementedColumn]) {
                newPieceSet[PlayerDiskSet][incrementedColumn].push(
                    incrementedRow
                );
            } else {
                newPieceSet[PlayerDiskSet][incrementedColumn] = [
                    incrementedRow,
                ];
            }

            // 相手の減る持ちコマ
            newPieceSet[OpponentPlayerDiskSet][incrementedColumn].splice(
                pieceSet[OpponentPlayerDiskSet][incrementedColumn].indexOf(
                    incrementedRow
                ),
                1
            );

            incrementedColumn = incrementedColumn + incrementArray[0];
            incrementedRow = incrementedRow + incrementArray[1];
        }

        //ERROR: はじめ白→黒で白にする際になってくれないのを直す→[-1,-1]のところが値が間違っていた
        setPieceSet({
            ...pieceSet,
            [PlayerDiskSet]: newPieceSet[PlayerDiskSet],
            [OpponentPlayerDiskSet]: newPieceSet[OpponentPlayerDiskSet],
        });
    };

    const putDisk = (column, row) => {
        directionsArray.forEach((direction) => {
            if (
                checkPossibilityToTurnOverOneDirection(
                    column,
                    row,
                    direction,
                    0
                )
            ) {
                turnOverDisk(column, row, direction, 0);
            }
        });
    };

    const checkFinish = () => {
        // TODO:check change to finish before to put all piece
        if (count === squareAllNum - 1 - 4) {
            let blackPieceNumber = 0;
            for (let key in pieceSet.blackCol) {
                blackPieceNumber += pieceSet.blackCol[key].length;
            }

            let whitePieceNumber = 0;
            for (let key in pieceSet.blackCol) {
                whitePieceNumber += pieceSet.whiteCol[key].length;
            }

            if (blackPieceNumber === whitePieceNumber) {
                setwinnerColor("draw");
            } else if (blackPieceNumber > whitePieceNumber) {
                setwinnerColor("black");
            } else {
                setwinnerColor("white");
            }
        }
    };

    const changePlayer = () => {
        setNextPlayerBlack((isNextPlayerBlack) => !isNextPlayerBlack);
    };

    const columns = [];
    for (let i = 0; i < squareNum.column; i++) {
        columns.push(
            <Column
                key={i}
                columnNum={i}
                pieceSet={pieceSet}
                squareClickHandlar={squareClickHandlar}
            />
        );
    }

    return (
        <div className="App">
            <div>nextPlayer: {isNextPlayerBlack ? "black" : "white"}</div>
            <div>Winner: {winnerColor}</div>
            <button onClick={changePlayer}>skip</button>
            <div className="board">{columns}</div>
        </div>
    );
}

// renderしかないものはfunction コンポーネントにしても良いはず
// function Column (props){ ... this.propsがpropsで参照できるように}
// 縦1ライン
class Column extends React.Component {
    render() {
        const squares = [];
        for (let i = 0; i < squareNum.row; i++) {
            squares.push(
                <Square
                    key={i}
                    columnNum={this.props.columnNum}
                    rowNum={i}
                    pieceSet={this.props.pieceSet}
                    squareClickHandlar={this.props.squareClickHandlar}
                />
            );
        }

        return <div className="column">{squares}</div>;
    }
}

// 横1マス
class Square extends React.Component {
    checkFirstSet(column, row) {
        if (this.props.pieceSet.blackCol[column]?.indexOf(row) > -1) {
            return <Piece color="black" />;
        }
        if (this.props.pieceSet.whiteCol[column]?.indexOf(row) > -1) {
            return <Piece color="white" />;
        }
    }

    render() {
        return (
            <div
                className="square"
                onClick={() => {
                    this.props.squareClickHandlar(
                        this.props.columnNum,
                        this.props.rowNum
                    );
                }}
                data-column={this.props.columnNum}
                data-row={this.props.rowNum}
            >
                {this.checkFirstSet(this.props.columnNum, this.props.rowNum)}
            </div>
        );
    }
}

// コマ
class Piece extends React.Component {
    render() {
        if (this.props.color === "black") {
            return <div className="piece piece--black"></div>;
        } else {
            return <div className="piece piece--white"></div>;
        }
    }
}

export default App;
