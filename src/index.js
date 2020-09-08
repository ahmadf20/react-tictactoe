import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import { MdClose } from "react-icons/md";
import { BiCircle } from "react-icons/bi";
import { IconContext } from "react-icons";



function Square(props) {


    return (
        <button
            className={`square 
                ${props.isSelected && 'selected'} 
                ${props.isHighlighted && 'highlighted'}`}
            onClick={props.onClick}
        >
            <IconContext.Provider value={{ color: `${props.value === 'X' ? "blue" : "red"}`, size: "2em" }}>
                {props.value === 'X' ? <MdClose />
                    : props.value === 'O' ? <BiCircle />
                        : null}
            </IconContext.Provider>

        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        console.log(this.props.winner);
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isSelected={this.props.location === i}
                isHighlighted={this.props.winner != null && this.props.winner.includes(i)}
            />
        );
    }

    render() {
        const rowItem = [];

        for (let i = 0; i < 9; i += 3) {

            const colItem = [];
            for (let j = 0; j < 3; j++) {
                colItem.push(this.renderSquare(i + j));
            }

            rowItem.push(
                <div className="board-row">
                    {colItem}
                </div>
            );
        }

        return (
            <div>
                {rowItem}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            history: [{
                squares: Array(9).fill(null),
                location: null, //display the location for each move
            }],
            xIsNext: true,
            stepNumber: 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (squares[i] || calculateWinner(squares)) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: i,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,

        });
    }

    jumpTo(step) {
        const history = this.state.history.slice(0, step + 1);
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            history: history,
        })
    }

    getLoct(index) {
        return {
            row: Math.trunc(index / 3),
            col: index % 3,
        }
    }



    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => { //TODO fix this
            //move is the index of the step in the array history
            //step is the history object which is a squares
            const loct = this.getLoct(step.location);
            const desc = move ? 'Go to move #' + move + ' (' + loct.col + ', ' + loct.row + ')' : 'Go to game start';
            return (
                <li key={move}>
                    {/* key is used to differ one item to the others in the list */}
                    <button
                        className="btn btn-outline-dark my-1"
                        onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        let status;

        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
        } else {
            if (current.squares.includes(null)) {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            } else {
                status = 'Draw';
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        location={current.location}
                        winner={winner}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="mb-3 ml-3">{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}




function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }

    }

    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
