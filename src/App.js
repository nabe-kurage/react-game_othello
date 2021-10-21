import React, { useState } from "react";
import "./App.css";

const squareNum = { column: 8, row: 8 };
const squareAllNum = 64;
let IsnextPlayerBlack = true;

// column = |||, row = 三
function App() {
    // const [defaultPieceSet, setDefaultPieceSet] = useState({
    //     white: [
    //         { column: 3, row: 3 },
    //         { column: 4, row: 4 },
    //     ],
    //     black: [
    //         { column: 3, row: 4 },
    //         { column: 4, row: 3 },
    //     ],
    // });
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

        let newPieceSet;
        if (IsnextPlayerBlack) {
            newPieceSet = pieceSet.blackCol;
        } else {
            newPieceSet = pieceSet.whiteCol;
        }

        if (newPieceSet[column]) {
            newPieceSet[column].push(row);
        } else {
            newPieceSet[column] = [row];
        }
        setPieceSet({ ...pieceSet, newPieceSet });

        IsnextPlayerBlack = !IsnextPlayerBlack;
        checkFinish();
    };

    //FIXME: 今のところ黒のみ判定
    const checkAbleToSetPeace = (column, row) => {
        // すでにコマが置かれていた場合新たにコマを置かない
        if (
            (pieceSet.whiteCol[column] &&
                pieceSet.whiteCol[column].indexOf(row) > -1) ||
            (pieceSet.blackCol[column] &&
                pieceSet.blackCol[column].indexOf(row) > -1)
        ) {
            console.log("すでに置かれたマスです");
            return false;
        }

        // const check = (item, column, row) => {
        //     // 存在するかチェック
        //     // 存在しなかったら return false
        //     // 相手の色が存在したらもう一回自分を呼んでそれをreturn
        //     // 自分の色が存在したらreturn true
        // };
        // if (item.column === column + 1 && item.row === row) {
        // }

        if (
            (pieceSet.whiteCol[column + 1] &&
                pieceSet.whiteCol[column + 1].indexOf(row) > -1) ||
            (pieceSet.whiteCol[column + 1] &&
                pieceSet.whiteCol[column + 1].indexOf(row + 1) > -1) ||
            (pieceSet.whiteCol[column + 1] &&
                pieceSet.whiteCol[column + 1].indexOf(row - 1) > -1) ||
            (pieceSet.whiteCol[column] &&
                pieceSet.whiteCol[column].indexOf(row + 1) > -1) ||
            (pieceSet.whiteCol[column] &&
                pieceSet.whiteCol[column].indexOf(row - 1) > -1) ||
            (pieceSet.whiteCol[column - 1] &&
                pieceSet.whiteCol[column - 1].indexOf(row) > -1) ||
            (pieceSet.whiteCol[column - 1] &&
                pieceSet.whiteCol[column - 1].indexOf(row + 1) > -1) ||
            (pieceSet.whiteCol[column - 1] &&
                pieceSet.whiteCol[column - 1].indexOf(row - 1) > -1)
        ) {
            return true;
        }
    };
    const checkFinish = () => {
        // TODO: check finish before to put piece to all square
        // TODO: check which player is winner
        console.log("checkFinish");
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
