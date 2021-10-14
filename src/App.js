import React from "react";
import "./App.css";

const squareNum = { column: 8, row: 8 };
const defaultPieceSet = {
    white: [
        { column: 3, row: 3 },
        { column: 4, row: 4 },
    ],
    black: [
        { column: 3, row: 4 },
        { column: 4, row: 3 },
    ],
};

function App() {
    const columns = [];
    for (let i = 0; i < squareNum.column; i++) {
        columns.push(<Column columnNum={i} />);
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
                <Square columnNum={this.props.columnNum} rowNum={i} />
            );
        }

        return <div className="column">{squares}</div>;
    }
}

// 横1マス
class Square extends React.Component {
    // TODO: 初期セットをおく
    checkFirstSet(column, row) {
        // setBlackPiece
        for (let i = 0; i < defaultPieceSet.black.length; i++) {
            if (
                column === defaultPieceSet.black[i].column &&
                row === defaultPieceSet.black[i].row
            ) {
                return <Piece color="black" />;
            }
        }

        // setWhitePiece
        for (let i = 0; i < defaultPieceSet.white.length; i++) {
            if (
                column === defaultPieceSet.white[i].column &&
                row === defaultPieceSet.white[i].row
            ) {
                return <Piece color="white" />;
            }
        }
    }

    render() {
        return (
            <div
                className="square"
                data-column={this.props.columnNum}
                data-rowNum={this.props.rowNum}
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
