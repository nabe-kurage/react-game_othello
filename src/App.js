import React, { useState } from "react";
import "./App.css";

const squareNum = { column: 8, row: 8 };
const squareAllNum = 64;
let IsnextPlayerBlack = true;

// column = |||, row = 三
// class App extends .. でもできる。その場合constructorやthis.stateといった感じでobujectを定義する形になる
function App() {
    let [count, setCount] = useState(0);
    const [pieceSet, setPieceSet] = useState({
        whiteCol: {
            3: [3],
            4: [4],
        },
        blackCol: {
            3: [4],
            4: [3],
        },
    });

    // コマをおく
    const clickHandlar = (column, row) => {
        if (!checkAbleToSetPeace(column, row)) {
            return;
        }

        let newPieceSet, colName;
        if (IsnextPlayerBlack) {
            colName = "blackCol";
            newPieceSet = pieceSet.blackCol;
        } else {
            colName = "whiteCol";
            newPieceSet = pieceSet.whiteCol;
        }

        if (newPieceSet[column]) {
            newPieceSet[column].push(row);
        } else {
            newPieceSet[column] = [row];
        }
        setPieceSet({ ...pieceSet, [colName]: newPieceSet });

        IsnextPlayerBlack = !IsnextPlayerBlack;
        setCount(count + 1);
        checkFinish();
    };

    const checkAbleToSetPeace = (column, row) => {
        // すでにコマが置かれていた場合新たにコマを置かない
        if (
            pieceSet.whiteCol[column]?.indexOf(row) > -1 ||
            pieceSet.blackCol[column]?.indexOf(row) > -1
        ) {
            console.log("すでに置かれたマスです");
            return false;
        }

        if (
            !checkAnablePutPeace(column, row, [0, 1], 0) &&
            !checkAnablePutPeace(column, row, [1, 0], 0) &&
            !checkAnablePutPeace(column, row, [1, 1], 0) &&
            !checkAnablePutPeace(column, row, [1, -1], 0) &&
            !checkAnablePutPeace(column, row, [0, -1], 0) &&
            !checkAnablePutPeace(column, row, [-1, 0], 0) &&
            !checkAnablePutPeace(column, row, [-1, -1], 0) &&
            !checkAnablePutPeace(column, row, [-1, 1], 0)
        ) {
            //FIXME 該当するものだけ変えるようにしないといけない。
            return false;
        }
        putPeace(column, row);

        return true;
    };

    const checkAnablePutPeace = (column, row, incrementArray, index) => {
        const PlayerPeaceSet = IsnextPlayerBlack ? "blackCol" : "whiteCol";
        const OpponentPlayerPeaceSet = !IsnextPlayerBlack
            ? "blackCol"
            : "whiteCol";

        const incrementedColumn = column + incrementArray[0];
        const incrementedRow = row + incrementArray[1];

        if (
            pieceSet[OpponentPlayerPeaceSet][incrementedColumn] &&
            pieceSet[OpponentPlayerPeaceSet][incrementedColumn].indexOf(
                incrementedRow
            ) > -1
        ) {
            return checkAnablePutPeace(
                incrementedColumn,
                incrementedRow,
                incrementArray,
                index + 1
            );
        }
        if (
            index > 0 &&
            pieceSet[PlayerPeaceSet][incrementedColumn] &&
            pieceSet[PlayerPeaceSet][incrementedColumn].indexOf(
                incrementedRow
            ) > -1
        ) {
            return true;
        }
        return false;
    };

    //TODO: ここで間のコマを反転させる
    const changePeace = (column, row, incrementArray, index) => {
        const PlayerPeaceSet = IsnextPlayerBlack ? "blackCol" : "whiteCol";
        const OpponentPlayerPeaceSet = !IsnextPlayerBlack
            ? "blackCol"
            : "whiteCol";

        // ERROR: 一個以上ひっくり返すときに一個しかひっくり返らない
        //SOLVE: whileして繰り返す
        let incrementedColumn = column + incrementArray[0];
        let incrementedRow = row + incrementArray[1];
        let newPieceSet = pieceSet;

        let colName, OpponentName;
        if (IsnextPlayerBlack) {
            colName = "blackCol";
            OpponentName = "whiteCol";
        } else {
            colName = "whiteCol";
            OpponentName = "blackCol";
        }

        while (
            pieceSet[OpponentPlayerPeaceSet][incrementedColumn] &&
            pieceSet[OpponentPlayerPeaceSet][incrementedColumn].indexOf(
                incrementedRow
            ) > -1
        ) {
            //  ここで新しいデータに変更
            if (newPieceSet[PlayerPeaceSet][incrementedColumn]) {
                newPieceSet[PlayerPeaceSet][incrementedColumn].push(
                    incrementedRow
                );
            } else {
                newPieceSet[PlayerPeaceSet][incrementedColumn] = [
                    incrementedRow,
                ];
            }

            newPieceSet[OpponentPlayerPeaceSet][incrementedColumn].splice(
                pieceSet[OpponentPlayerPeaceSet][incrementedColumn].indexOf(
                    incrementedRow
                ),
                1
            );

            if (
                newPieceSet[OpponentPlayerPeaceSet][incrementedColumn]
                    .length === 0
            ) {
                delete newPieceSet[OpponentPlayerPeaceSet][incrementedColumn];
            }

            incrementedColumn = incrementedColumn + incrementArray[0];
            incrementedRow = incrementedRow + incrementArray[1];
        }

        //ERROR: はじめ白→黒で白にする際になってくれないのを直す
        //SOLVE:  [-1,-1]のところが値が間違っていた

        setPieceSet({
            ...pieceSet,
            [colName]: newPieceSet[PlayerPeaceSet],
            [OpponentName]: newPieceSet[OpponentPlayerPeaceSet],
        });

        return checkAnablePutPeace(
            incrementedColumn,
            incrementedRow,
            incrementArray,
            index + 1
        );
    };

    const putPeace = (column, row) => {
        if (checkAnablePutPeace(column, row, [0, 1], 0)) {
            changePeace(column, row, [0, 1], 0);
        }
        if (checkAnablePutPeace(column, row, [0, -1], 0)) {
            changePeace(column, row, [0, -1], 0);
        }
        if (checkAnablePutPeace(column, row, [1, 0], 0)) {
            changePeace(column, row, [1, 0], 0);
        }
        if (checkAnablePutPeace(column, row, [1, 1], 0)) {
            changePeace(column, row, [1, 1], 0);
        }
        if (checkAnablePutPeace(column, row, [1, -1], 0)) {
            changePeace(column, row, [1, -1], 0);
        }
        if (checkAnablePutPeace(column, row, [-1, 0], 0)) {
            changePeace(column, row, [-1, 0], 0);
        }
        if (checkAnablePutPeace(column, row, [-1, 1], 0)) {
            changePeace(column, row, [-1, 1], 0);
        }
        if (checkAnablePutPeace(column, row, [-1, -1], 0)) {
            changePeace(column, row, [-1, -1], 0);
        }

        console.log(pieceSet);
    };
    const checkFinish = () => {
        // TODO: check finish before to put piece to all square
        // TODO: check which player is winner
        if (count === squareAllNum) {
            console.log("finish");
            // TODO: winner check
        }
    };

    const columns = [];
    for (let i = 0; i < squareNum.column; i++) {
        columns.push(
            <Column
                key={i}
                columnNum={i}
                pieceSet={pieceSet}
                clickHandlar={clickHandlar}
            />
        );
    }

    return (
        <div className="App">
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
                    clickHandlar={this.props.clickHandlar}
                />
            );
        }

        return <div className="column">{squares}</div>;
    }
}

// 横1マス
class Square extends React.Component {
    checkFirstSet(column, row) {
        if (
            this.props.pieceSet.blackCol[column] &&
            this.props.pieceSet.blackCol[column].indexOf(row) > -1
        ) {
            return <Piece color="black" />;
        }
        if (
            this.props.pieceSet.whiteCol[column] &&
            this.props.pieceSet.whiteCol[column].indexOf(row) > -1
        ) {
            return <Piece color="white" />;
        }
    }

    render() {
        return (
            <div
                className="square"
                onClick={() => {
                    this.props.clickHandlar(
                        this.props.columnNum,
                        this.props.rowNum
                    );
                }}
                data-column={this.props.columnNum}
                data-row={this.props.rowNum}
            >
                c:{this.props.columnNum}
                r:{this.props.rowNum}
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
