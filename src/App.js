import React from "react";
import "./App.css";

function App() {
    return (
        <div className="App">
            {/* <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header> */}

            <div className="board">
                <Column />
                <Column />
                <Column />
                <Column />
                <Column />
                <Column />
                <Column />
                <Column />
            </div>
        </div>
    );
}
class Column extends React.Component {
    render() {
        return (
            <div className="line">
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
            </div>
        );
    }
}

export default App;
