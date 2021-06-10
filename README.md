# ReactJS tutorial recommended follow-up practices

## 1. Display the location for each move in the format (col, row) in the move history list.

When creating the game board, each of the squares on the board is assigned a number of 0-9 via the **renderSquare(i)** function in the **Board**. class. Using a little bit of mathemagics, we can convert those numbers into their row/column equivalents. In order to extract those numbers for use on the jump buttons that show up below our status, we need to maintain a record (we'll call it **squareClicked**) in the state of the program of which button was clicked. This record should be maintained in each step of the **history[]** array, as maintaining the record in the Game's overall state would cause it to get rewritten on each move. We will want to record the index (i-value) during the Board's handleClick function which is called each time the user clicks the board.
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

Now, during the mapping over the **history[]** array which creates our historical jump-list, we can perform our mathemagics to get the 1-indexed row/col values and insert them into the button descriptions.

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

We create a state value called **recentJumpIndex** which is set equal to **step**(the index of our **history[]** array) when we click on one of the move list buttons. This can be used to indicate that a jump was made as the last button click, and it indicates the index to which the jump was made. When we click on the board again, we reset our **recentJumpIndex** to a value of -1, which obviously does not match the index of any move in our **history[]** array.

When rendering our jump menu, we will check via a ternary operator to see if **move**(confusingly, the tutorial has used "move" for the index and "step" for the name of the historical object/state during the mapping of the **history[]** array) is equal to the **recentJumpIndex** of the app, and if so then we will render that menu item with a bold font-weight via a style prop.

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
## 3. Rewrite Board to use two loops to make the squares instead of hardcoding them

This one threw me for a bit of a loop (no pun intended) because at first blush it seemed to simply be a request to write a nested for loop that counted to 9. Admittedly, the final implementation of the code in question still resembles that, but it required a few iterations because I was (and still am) unsure of exactly how and when I can mix HTML into my javascript in React. Simply creating 9 squares via nested for-loops would create a single, horizontal line of squares on the page because I needed to intersperse them with a board-row div after every third square. So I plugged every three squares into a separate **row[]** array and went about Googling how to intersperse HTML in the middle of a for-loop. After some searching, I came to the solution below where I simply pushed the HTML into a **board[]** array, and relied on React to translate the **<div ...>** into the appropriate calls behind the scenes thanks to the magic(?) of JSX. 

```javascript
class Board extends React.Component {
  ...
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
```

Even though I had set a key for the elements in the **board[]** array, I was still getting an error in the console for missing keys. I realized that since the squares were now being generated programmatically rather than hardcoded, they now needed their own keys as well to prevent that error from showing up.

```javascript
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        key={i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
}
```

## 4. Add a toggle button that lets you sort the moves in either ascending or descending order.

Starting from the top down, we'll first add a button which will trigger a function named **toggleListDirection()** which we will then implement. Our new function will serve simply to flip a state variable named **moveListAscending** (which we will default to *true* in the **Game** component's constructor) to the opposite of whatever its current value is. 

```javascript
class Game extends React.Component {
  ...
  toggleListDirection() {
    this.setState({
      moveListAscending: !this.state.moveListAscending,
    });
  }

  render() {
    ...
    return (
        ...
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleListDirection()}>Asc/Desc</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
```

This seems to work in this case, but according to the React docs (https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous) we should not rely on the previous state to calculate the state because state updates may be asynchronous. The tutorial had us do this up in the **handleClick(i)** function when calculating **xisNext**, but for the sake of correctness I will follow the recommendation of the React docs and utilize the secondary form of **setState()**.

```javascript
  toggleListDirection() {
    this.setState((state) => ({
      moveListAscending: !state.moveListAscending,
    }));
  }
```

Considering our problem, it seems like the simplest solution would be to simply reverse the array that forms the movelist during the **Game** component's **render()** function and allow the rendering process to proceed as normal. Following that train of thought, we would then consider that the generation of the movelist occurs by mapping over the **history[]** array and returning a list element for each element accessed in the array. Following the pattern of the tutorial, we want to minimize mutations to the **history[]** array, thus if our **moveListAscending** state variable is false, we will map over a **history.slice().reverse()** array instead. This way we will only be reversing a slice of our original array, and the expensive reverse function is only being called if the state variable is false.

As a final step, we must accomodate for the fact that reversing our array before mapping over it results in the **move** variable (the index of the elements in our newly-mapped array) now being incorrect values when the list is reversed. Reversing the list for a game of N moves and clicking on the final move(move N) will still take you to game start (move 0). This is fixed by replacing functional references to the **move** variable with a new variable (**reversibleIndex** in my case) whose value is determined by another check to the value of **moveListAscending**.

```javascript
class Game extends React.Component {
  ...
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
    ...
  }
}
