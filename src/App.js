import React from "react";
import "./App.css";

const squareNum = { column: 8, row: 8 };
const defaultPieceSet = {
    white: [
        [3, 3],
        [4, 4],
    ],
    black: [
        [3, 4],
        [4, 3],
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
        if ((column === 4 && row === 4) || (column === 3 && row === 3)) {
            return <Piece />;
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
        return <div className="piece piece--black"></div>;
    }
}

export default App;
