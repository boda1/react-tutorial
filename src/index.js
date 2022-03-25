import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const winningSquareStyle = {
    backgroundColor: '#ccc'
  }
  return (
    // set style of square depending on whether a player has yet won
    <button className="square" onClick={props.onClick} style={props.winningSquare ? winningSquareStyle : null}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    // calculate whether a player has yet won for the purpose of highlighting winning squares
    let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningSquare = {winningSquare}
      />
    );
  }

  render() {

    // create three rows containing three squares each
    
    // 0 1 2
    // 3 4 5 
    // 6 7 8

    let allSquares = [];
    for (let row = 0; row < 3; row++) {
      let boardRow = [];
      for (let col = 0; col < 3; col++) {
        boardRow.push(<span key={(row * 3) + col}>{this.renderSquare((row * 3) + col)}</span>)
      }
      allSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }
    // console.log(allSquares);

    return (
        <div>
          {allSquares}
        </div>
    );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        colRow: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      ascending: true
    };
  }

  sortHandleClick() {
    this.setState({
      ascending: !this.state.ascending
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = current.colRow.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    location[this.state.stepNumber + 1] = calculateLocation(i);
    this.setState({
      history: history.concat([{
        squares: squares,
        colRow: location
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const ascending = this.state.ascending;
    const winningLine = winner ? winner.winningLine: null;

    // console.log(winningLine);

    const moves = history.map((step, move, history) => {      
      const desc = move ?
      'Go to move #' + move + ', move location: ' + history[move].colRow[move]: 
      'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{move === this.state.stepNumber ? <b>{desc}</b> : desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner && winner.winningLine}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.sortHandleClick()}>Toggle Order</button>
          <div>{status}</div>
          <ol>{ascending ? moves: moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateLocation(i) {
  let locationCheck = [];
  if (i === 0 || i === 3 || i === 6) {
    locationCheck[0] = 1;
  } else if (i === 1 || i === 4 || i === 7) {
    locationCheck[0] = 2;
  } else if (i === 2 || i === 5 || i === 8) {
    locationCheck[0] = 3;
  }

  if (i === 0 || i === 1 || i === 2) {
    locationCheck[1] = 1;
  } else if (i === 3 || i === 4 || i === 5) {
    locationCheck[1] = 2;
  } else if (i === 6 || i === 7 || i === 8) {
    locationCheck[1] = 3;
  }
  return locationCheck;
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
      return {
        winner: squares[a],
        winningLine: lines[i]
      }
    }
  }
  return null;
}

