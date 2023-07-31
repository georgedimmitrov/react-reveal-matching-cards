import { useState } from "react";
import "./App.css";

type coordsTuple = [number, number];
interface CardProps {
  value: number;
  isRevealed: boolean;
  isCompleted: boolean;
}

function App() {
  const [grid, setGrid] = useState([
    [
      { value: 0, isRevealed: false, isCompleted: false },
      { value: 3, isRevealed: false, isCompleted: false },
      { value: 5, isRevealed: false, isCompleted: false },
      { value: 1, isRevealed: false, isCompleted: false },
    ],
    [
      { value: 1, isRevealed: false, isCompleted: false },
      { value: 2, isRevealed: false, isCompleted: false },
      { value: 2, isRevealed: false, isCompleted: false },
      { value: 4, isRevealed: false, isCompleted: false },
    ],
    [
      { value: 4, isRevealed: false, isCompleted: false },
      { value: 5, isRevealed: false, isCompleted: false },
      { value: 3, isRevealed: false, isCompleted: false },
      { value: 0, isRevealed: false, isCompleted: false },
    ],
  ]);

  const [previousClickCoords, setPreviousClickCoords] = useState<coordsTuple>([
    -1, -1,
  ]);

  function handleCardClicked(rowIndex: number, colIndex: number) {
    // clicking on completed card -> do nothing
    if (grid[rowIndex][colIndex].isCompleted) {
      return;
    }

    if (previousClickCoords[0] !== -1 && previousClickCoords[1] !== -1) {
      // second click
      //   - if clicking on the same card -> do nothing
      if (
        rowIndex === previousClickCoords[0] &&
        colIndex === previousClickCoords[1]
      ) {
        return;
      } else {
        // reveal the card the user clicked
        revealClickedCard(rowIndex, colIndex);

        if (
          grid[previousClickCoords[0]][previousClickCoords[1]].value !==
          grid[rowIndex][colIndex].value
        ) {
          // if the selected pair is not matching -> hide after 1 second and reset previously clicked coords
          setTimeout(() => {
            hideWronglyClickedCard(
              previousClickCoords[0],
              previousClickCoords[1]
            );
            hideWronglyClickedCard(rowIndex, colIndex);
            setPreviousClickCoords([-1, -1]);
          }, 500);
        } else {
          // correctly guessed the same cards - mark as answered and reset previously clicked coords
          markClickedCardAsCompleted(
            previousClickCoords[0],
            previousClickCoords[1]
          );
          markClickedCardAsCompleted(rowIndex, colIndex);
          setPreviousClickCoords([-1, -1]);
        }
      }
    } else {
      // first click of two clicks -> reveal the card and set it as previously clicked coords
      revealClickedCard(rowIndex, colIndex);
      setPreviousClickCoords([rowIndex, colIndex]);
    }
  }

  function revealClickedCard(rowIndex: number, colIndex: number) {
    modifyCard(rowIndex, colIndex, "isRevealed", true);
  }

  function hideWronglyClickedCard(rowIndex: number, colIndex: number) {
    modifyCard(rowIndex, colIndex, "isRevealed", false);
  }

  function markClickedCardAsCompleted(rowIndex: number, colIndex: number) {
    modifyCard(rowIndex, colIndex, "isCompleted", true);
  }

  function modifyCard(
    rowIndex: number,
    colIndex: number,
    prop: keyof Pick<CardProps, "isCompleted" | "isRevealed">,
    value: boolean
  ) {
    const modifiedGrid = grid.map((item) => item.slice());
    modifiedGrid[rowIndex][colIndex][prop] = value;
    setGrid(modifiedGrid);
  }

  return (
    <>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((currentCard, colIndex) => (
              <div
                onClick={(_) => handleCardClicked(rowIndex, colIndex)}
                className={`col card ${
                  currentCard.isCompleted ? "is-completed" : ""
                }`}
                key={colIndex}
              >
                {}
                {currentCard.isRevealed === true ? currentCard.value : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
