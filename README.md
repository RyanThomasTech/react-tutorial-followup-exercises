# ReactJS tutorial recommended follow-up practices

## 1. Display the location for each move in the format (col, row) in the move history list.

When creating the game board, each of the squares on the board is assigned a number of 0-9 via the **renderSquare(i)** function in the **Board**. class. Using a little bit of mathemagics, we can convert those numbers into their row/column equivalents. In order to extract those numbers for use on the jump buttons that show up below our status, we need to maintain a record (we'll call it **squareClicked**) in the state of the program of which button was clicked. This record should be maintained in each step of the history array, as maintaining the record in the Game's overall state would cause it to get rewritten on each move. We will want to record the index (i-value) during the Board's handleClick function which is called each time the user clicks the board.
```javascript
class Board extends React.Component {
    ...
    handleClick(i) {
        ...
        this.setState({
          history: history.concat([
            {
              squares: squares,
              squareClicked: i,
            }
          ]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
    ...
}
```

Now, during the mapping over the history array which creates our historical jump-list, we can perform our mathemagics to get the 1-indexed row/col values and insert them into the button descriptions.

```javascript
class Game extends React.Component {
  ...
  render() {
    ...
    const moves = history.map((step, move) => {
      const squareClicked = step.squareClicked;
      const col = Math.floor(squareClicked / 3) + 1;
      const row = squareClicked%3 + 1;

      const desc = move ?
        'Go to move #' + move + " (" + col + ", " + row + ")":
        'Go to game start';
      return (
        ...
      );
    });
    ...
  }
}
```
