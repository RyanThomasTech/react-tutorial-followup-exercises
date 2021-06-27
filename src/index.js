import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) { let className = "square";
    if (this.props.winner.includes(i)){
        className += " winner";
    }
    return (
      <Square
        value={this.props.squares[i]}
        key={i}
        onClick={() => this.props.onClick(i)}
        className={className}
      />
    );
  }

  render() {
    let board = [];
    let squareNum = 0;
    for (let rowNum = 0; rowNum <3; rowNum++){
        let row = [];
        for (let colNum = 0; colNum <3; colNum++){
            row.push(this.renderSquare(squareNum));
            squareNum++;
        }
        board.push(<div key={rowNum} className="board-row">{row}</div>);
    }

    return (
        <div>
            {board}
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
      moveListAscending: true,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[1]>0 || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          squareClicked: i,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      recentJumpIndex: -1,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      recentJumpIndex: step,
    });
  }

  toggleListDirection() {
    this.setState((state) => ({
      moveListAscending: !state.moveListAscending,
    }));
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = (this.state.moveListAscending ? history : history.slice().reverse() ).map((step, move) => {
      const squareClicked = step.squareClicked;
      const col = Math.floor(squareClicked / 3) + 1;
      const row = squareClicked%3 + 1;

      const reversibleIndex = (this.state.moveListAscending ? move : (history.length-move)-1);

      const desc = reversibleIndex ?
        'Go to move #' + reversibleIndex + " (" + col + ", " + row + ")":
        'Go to game start';

      return (
        <li key={reversibleIndex}>
          <button
            onClick={() => this.jumpTo(reversibleIndex)}
            style={ reversibleIndex === this.state.recentJumpIndex ? {fontWeight: 'bold'} : {fontWeight: 'normal'} }>
              {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner[1]>0) {
      status = "Winner: " + current.squares[winner[1]];
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleListDirection()}>Asc/Desc</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
      return [a,b,c];
    }
  }
  return [-1,-1,-1];
}

