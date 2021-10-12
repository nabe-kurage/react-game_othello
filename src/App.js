import React from "react";
import "./App.css";

const squareNum = { column: 8, row: 8 };

function App() {
    const columns = [];
    for (let i = 0; i < squareNum.column; i++) {
        columns.push(<Column rowNum={i} />);
    }

    return (
        <div className="App">
            <div className="board">{columns}</div>
        </div>
    );
}

class Column extends React.Component {
    render() {
        const squares = [];
        for (let i = 0; i < squareNum.row; i++) {
            squares.push(<div className="square" data-rowNum={i}></div>);
        }

        return (
            <div className="columns" data-rowNum={this.props.rowNum}>
                {squares}
            </div>
        );
    }
}

class Piece extends React.Component {
    render() {
        return <div className="piece piece--black"></div>;
    }
}

export default App;
