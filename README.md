# ReactJS tutorial recommended follow-up practices

## Display the location for each move in the format (col, row) in the move history list.

When creating the game board, each of the squares on the board is assigned a number of 0-9 via the *renderSquare(i)* function in the *Board* class. Using a little bit of mathemagics, we can convert those numbers into their row/column equivalents. In order to put them on the jump buttons that show up below our status, we need to maintain a record in the state of the program of which button was clicked. This record should be maintained in each step of the history array, thus we will want to record the index (i-value) during the handleClick function.
```javascript
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
```

