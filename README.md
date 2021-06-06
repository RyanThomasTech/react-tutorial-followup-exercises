# ReactJS tutorial recommended follow-up practices

## 1. Display the location for each move in the format (col, row) in the move history list.

When creating the game board, each of the squares on the board is assigned a number of 0-9 via the **renderSquare(i)** function in the **Board**. class. Using a little bit of mathemagics, we can convert those numbers into their row/column equivalents. In order to extract those numbers for use on the jump buttons that show up below our status, we need to maintain a record (we'll call it **squareClicked**) in the state of the program of which button was clicked. This record should be maintained in each step of the history array, as maintaining the record in the Game's overall state would cause it to get rewritten on each move. We will want to record the index (i-value) during the Board's handleClick function which is called each time the user clicks the board.
```javascript
class Game extends React.Component {
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

## 2. Bold the currently selected item in the move list

When we select an item in the move list, we trigger a call in the **jumpTo(step)** function in the game, so it follows naturally that we will first look here in order to alter the game state to record that a jump to a specific step has just occurred. We will then want to render that step's button with bold text while we are rendering the entire move list. Finally, we will want to ensure that the bolded section does not remain bolded once we resume the game from the selected point, so we will look to **handleClick(i)** function (called by clicking on the board) in order to reset our jump flag.

```javascript
class Game extends React.Component {
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
}
```

We create a state value called **recentJumpIndex** which is set equal to **step**(the index of our history array) when we click on one of the move list buttons. This can be used to indicate that a jump was made as the last button click, and it indicates the index to which the jump was made. When we click on the board again, we reset our **recentJumpIndex** to a value of -1, which obviously does not match the index of any move in our history array.

When rendering our jump menu, we will check via a ternary operator to see if **move**(confusingly, the tutorial has used "move" for the index and "step" for the name of the historical object/state during the mapping of the history array) is equal to the **recentJumpIndex** of the app, and if so then we will render that menu item with a bold font-weight via a style prop.

```javascript
class Game extends React.Component {
    ...
    render(){
      ...
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={ move === this.state.recentJumpIndex ? {fontWeight: 'bold'} : {fontWeight: 'normal'} }>
              {desc}
          </button>
        </li>
      );
    ... 
}
```

