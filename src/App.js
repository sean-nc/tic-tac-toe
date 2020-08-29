import React from 'react';
import './App.css';

// allow changing of levels
// level 1 — random
// level 2 - random with a % playing best move
// level 3 - always play best move

// allow user to switch between O and X

// use algorithms and not machine learning, this is a solved problem, it doesn't need AI

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i] || this.state.xIsNext) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    if (this.state.xIsNext) {
      // disable all buttons

      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const i = computerPlay(squares);

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? "X" : "O";
      
      setTimeout(
        () => this.setState({
          history: history.concat([
            {
              squares: squares
            }
          ]),
          stepNumber: history.length,
          xIsNext: false
        }), 
        1000
      );

      // enable all buttons - maybe in the callback
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "Computer" : "You");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function computerPlay(squares) {
  const nullNumbers = [];
  const oWinning = [];
  const oNumbers = [];
  const xNumbers = [];


  for (let i = 0; i < 9; i++) {  

    let tempSquares = squares;

    if (tempSquares[i] === 'X') {
      xNumbers.push(i)
    } else if (tempSquares[i] === 'O') {
      oNumbers.push(i)
    } else {
      // can X win?
      tempSquares[i] = 'X'
      if (calculateWinner(tempSquares)) {
        tempSquares[i] = null
        return i;
      }

      // can O win?
      tempSquares[i] = 'O'
      if (calculateWinner(tempSquares)) {
        oWinning.push(i)
      }

      // keep track of nulls for random assignment
      tempSquares[i] = null
      nullNumbers.push(i)
    }
  }

  // return a number to block
  if (oWinning.length > 0) {
    return oWinning[0];
  }

  // first move is always 6
  if (nullNumbers.length === 9) {
    return 6;
  }


  const edges = [1, 3, 5, 7]
  const corners = [0, 2, 8]
  const center = 4

  // if O plays once
  if (oNumbers.length === 1) {
    // play edges
    if (edges.includes(oNumbers[0])) {
      return 2
    }

    // play corner
    if (corners.includes(oNumbers[0])) {
      return corners[1] !== oNumbers[0] ? 2 : 8
    }

    // play center
    if (center === oNumbers[0]) {
      return 2
    }
  }

  // return random number
  return randomItem(nullNumbers);
}

function randomItem(items) {
  return items[Math.floor(Math.random()*items.length)];
}

function App() {
  return (
    <Game />
  );
}

export default App;
