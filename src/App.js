import React, { useState } from "react";
import "./App.css";

const squareNum = { column: 8, row: 8 };
const squareAllNum = 64;
let IsnextPlayerBlack = true;

// class App extends .. でもできる。その場合constructorやthis.stateといった感じでobujectを定義する形になる
function App() {
    const [defaultPieceSet, setDefaultPieceSet] = useState({
        white: [
            { column: 3, row: 3 },
            { column: 4, row: 4 },
        ],
        black: [
            { column: 3, row: 4 },
            { column: 4, row: 3 },
        ],
    });

    // コマをおく
    const clickHandlar = (column, row) => {
        // すでにコマが置かれていた場合新たにコマを置かない
        for (let item of defaultPieceSet.black) {
            if (item.column === column && item.row === row) {
                return;
            }
        }
        for (let item of defaultPieceSet.white) {
            if (item.column === column && item.row === row) {
                return;
            }
        }

        if (IsnextPlayerBlack) {
            // 左右どちらかにある白がある場合おく
            for (let item of defaultPieceSet.white) {
                if (checkAbleToSetPeace(item, column, row)) {
                    setDefaultPieceSet({
                        ...defaultPieceSet,
                        black: [
                            ...defaultPieceSet.black,
                            { column: column, row: row },
                        ],
                    });
                    IsnextPlayerBlack = !IsnextPlayerBlack;
                }
            }
        } else {
            setDefaultPieceSet({
                ...defaultPieceSet,
                white: [...defaultPieceSet.white, { column: column, row: row }],
            });
            IsnextPlayerBlack = !IsnextPlayerBlack;
        }
        checkFinish();
    };

    //FIXME: 今のところ黒のみ判定
    const checkAbleToSetPeace = (item, column, row) => {
        if (
            (item.column === column + 1 && item.row === row) ||
            (item.column === column - 1 && item.row === row) ||
            (item.column === column && item.row === row + 1) ||
            (item.column === column && item.row === row - 1) ||
            (item.column === column + 1 && item.row === row + 1) ||
            (item.column === column + 1 && item.row === row - 1) ||
            (item.column === column - 1 && item.row === row + 1) ||
            (item.column === column - 1 && item.row === row - 1)
        ) {
            return true;
        }
        return false;
    };
    const checkFinish = () => {
        // TODO: check finish before to put piece to all square
        if (
            defaultPieceSet.white.length + defaultPieceSet.black.length ===
            squareAllNum
        ) {
            console.log("finish");
        }
        // TODO: check which player is winner
    };

    const columns = [];
    for (let i = 0; i < squareNum.column; i++) {
        columns.push(
            <Column
                key={i}
                columnNum={i}
                defaultPieceSet={defaultPieceSet}
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
                    defaultPieceSet={this.props.defaultPieceSet}
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
        // setBlackPiece
        for (let i = 0; i < this.props.defaultPieceSet.black.length; i++) {
            if (
                column === this.props.defaultPieceSet.black[i].column &&
                row === this.props.defaultPieceSet.black[i].row
            ) {
                return <Piece color="black" />;
            }
        }
        // setWhitePiece
        for (let i = 0; i < this.props.defaultPieceSet.white.length; i++) {
            if (
                column === this.props.defaultPieceSet.white[i].column &&
                row === this.props.defaultPieceSet.white[i].row
            ) {
                return <Piece color="white" />;
            }
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
