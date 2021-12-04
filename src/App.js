import React, { useState } from "react";
import "./App.css";
import useSound from "use-sound";
import hover from "./sound/hover4.mp3";
import click from "./sound/click.mp3";
import {
    squareNum,
    directionsArray,
    squareAllNum,
    defaultDiskSet,
    COLUMN,
} from "./constData.js";
import { GreedyPlayer } from "./othelloAI";

const othelloAi = new GreedyPlayer();

// column = |||, row = 三
// class App extends .. でもできる。その場合constructorやthis.stateといった感じでobujectを定義する形になる
function App() {
    let [count, setCount] = useState(0);
    let [skipCounter, setSkipCounter] = useState(0);
    const [diskSet, setDiskSet] = useState({ ...defaultDiskSet });
    const [isNextPlayerBlack, setNextPlayerBlack] = useState(true);
    const [winnerColor, setwinnerColor] = useState(null);
    const [hoverSoundPlay, { stop }] = useSound(hover, {
        playbackRate: 1.5,
        volume: 0.1,
    });

    const [clickSoundPlay] = useSound(click);
    const squareClickHandlar = (column, row) => {
        if (winnerColor || !checkAbleToPutDisk(column, row)) {
            return;
        }

        let newDiskSet, colName;
        if (isNextPlayerBlack) {
            colName = COLUMN.BLACK;
            newDiskSet = diskSet.blackCol;
        } else {
            colName = COLUMN.WHITE;
            newDiskSet = diskSet.whiteCol;
        }

        if (newDiskSet[column]) {
            newDiskSet[column].push(row);
        } else {
            newDiskSet[column] = [row];
        }
        setDiskSet({ ...diskSet, [colName]: newDiskSet });
        changePlayer();

        setCount(count + 1);
        setSkipCounter(0);

        checkFinish();
        aiCheck();
    };

    const aiCheck = () => {
        // TODO: check next ai turn
        if (!isNextPlayerBlack) {
            console.log(othelloAi.computeBestMove(defaultDiskSet, false));
        }
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
            diskSet.whiteCol[column]?.indexOf(row) > -1 ||
            diskSet.blackCol[column]?.indexOf(row) > -1
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
            diskSet[OpponentPlayerDiskSet][incrementedColumn]?.indexOf(
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
            diskSet[PlayerDiskSet][incrementedColumn]?.indexOf(incrementedRow) >
                -1
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
        let newDiskSet = diskSet;

        while (
            diskSet[OpponentPlayerDiskSet][incrementedColumn]?.indexOf(
                incrementedRow
            ) > -1
        ) {
            // 自分の増える持ちコマ
            if (newDiskSet[PlayerDiskSet][incrementedColumn]) {
                newDiskSet[PlayerDiskSet][incrementedColumn].push(
                    incrementedRow
                );
            } else {
                newDiskSet[PlayerDiskSet][incrementedColumn] = [incrementedRow];
            }

            // 相手の減る持ちコマ
            newDiskSet[OpponentPlayerDiskSet][incrementedColumn].splice(
                diskSet[OpponentPlayerDiskSet][incrementedColumn].indexOf(
                    incrementedRow
                ),
                1
            );

            incrementedColumn = incrementedColumn + incrementArray[0];
            incrementedRow = incrementedRow + incrementArray[1];
        }

        //ERROR: はじめ白→黒で白にする際になってくれないのを直す→[-1,-1]のところが値が間違っていた
        setDiskSet({
            ...diskSet,
            [PlayerDiskSet]: newDiskSet[PlayerDiskSet],
            [OpponentPlayerDiskSet]: newDiskSet[OpponentPlayerDiskSet],
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
        if (count === squareAllNum - 1 - 4) {
            judgeWinner();
        }
    };

    const judgeWinner = () => {
        let blackDiskNumber = 0;
        for (let key in diskSet.blackCol) {
            blackDiskNumber += diskSet.blackCol[key].length;
        }

        let whiteDiskNumber = 0;
        for (let key in diskSet.whiteCol) {
            whiteDiskNumber += diskSet.whiteCol[key].length;
        }

        if (blackDiskNumber === whiteDiskNumber) {
            setwinnerColor("draw");
        } else if (blackDiskNumber > whiteDiskNumber) {
            setwinnerColor("black");
        } else {
            setwinnerColor("white");
        }
    };

    const changePlayer = () => {
        setNextPlayerBlack((isNextPlayerBlack) => !isNextPlayerBlack);
    };

    const skipButtonHandler = () => {
        if (skipCounter > 0) {
            judgeWinner();
            return;
        }

        setSkipCounter(skipCounter + 1);
        changePlayer();
    };

    const columns = [];
    for (let i = 0; i < squareNum.column; i++) {
        columns.push(
            <Column
                key={i}
                columnNum={i}
                diskSet={diskSet}
                squareClickHandlar={squareClickHandlar}
                hoverSoundLoadHandlar={hoverSoundPlay}
                hoverSoundStopHandlar={stop}
                clickSoundLoadHandlar={clickSoundPlay}
            />
        );
    }

    return (
        <div className="App">
            <div>nextPlayer: {isNextPlayerBlack ? "black" : "white"}</div>
            <div>Winner: {winnerColor}</div>
            <button onClick={skipButtonHandler} className="skipButton">
                skip
            </button>
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
                    diskSet={this.props.diskSet}
                    squareClickHandlar={this.props.squareClickHandlar}
                    hoverSoundLoadHandlar={this.props.hoverSoundLoadHandlar}
                    hoverSoundStopHandlar={this.props.hoverSoundStopHandlar}
                    clickSoundLoadHandlar={this.props.clickSoundLoadHandlar}
                />
            );
        }

        return <div className="column">{squares}</div>;
    }
}

// 横1マス
class Square extends React.Component {
    checkFirstSet(column, row) {
        if (this.props.diskSet.blackCol[column]?.indexOf(row) > -1) {
            return <Disk color="black" />;
        }
        if (this.props.diskSet.whiteCol[column]?.indexOf(row) > -1) {
            return <Disk color="white" />;
        }
    }

    render() {
        return (
            <div
                className="square"
                onClick={() => {
                    this.props.hoverSoundLoadHandlar();
                    this.props.squareClickHandlar(
                        this.props.columnNum,
                        this.props.rowNum
                    );
                }}
                onMouseOver={() => {
                    this.props.hoverSoundStopHandlar();
                    this.props.hoverSoundLoadHandlar();
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
class Disk extends React.Component {
    render() {
        if (this.props.color === "black") {
            return <div className="disk disk--black"></div>;
        } else {
            return <div className="disk disk--white"></div>;
        }
    }
}

export default App;
