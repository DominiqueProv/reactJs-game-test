import React, { useState, useRef } from 'react';
import './App.css';
import { saveToLocalStorage, getFromLocalStorage } from './utils/storageHelper';

const App = () => {
  const [isRandom, setIsRandom] = useState(false);
  const [cpuRandom, setCpuRandom] = useState('Random');
  const [result, setResult] = useState('');
  const [roundWinner, setRoundWinner] = useState('');
  const [lives, setLives] = useState(0);
  const [botLives, setBotLives] = useState(0);
  const livesNumRef = useRef(0);
  const botLivesNumRef = useRef(0);
  let winner;
  let botSelection;

  const play = (pick) => {
    if (isRandom) {
      let pickArr = getFromLocalStorage('pick') || [];
      if (pickArr.length === 0) {
        botSelection = Math.floor(Math.random() * 3 + 1);
        if (botSelection === 1) {
          botSelection = 'rock';
          pickArr.push(botSelection);
          saveToLocalStorage('pick', pickArr);
        } else if (botSelection === 2) {
          botSelection = 'paper';
          pickArr.push(botSelection);
          saveToLocalStorage('pick', pickArr);
        } else {
          botSelection = 'scissor';
          pickArr.push(botSelection);
          saveToLocalStorage('pick', pickArr);
        }
      } else if (pickArr.length === 1) {
        if (pickArr[0] === 'rock') {
          botSelection = 'paper';
          pickArr.push(botSelection);
          pickArr.splice(0, 1);
          saveToLocalStorage('pick', pickArr);
        } else if (pickArr[0] === 'paper') {
          botSelection = 'scissor';
          pickArr.push(botSelection);
          pickArr.splice(0, 1);
          saveToLocalStorage('pick', pickArr);
        } else if (pickArr[0] === 'scissor') {
          botSelection = 'rock';
          pickArr.push(botSelection);
          pickArr.splice(0, 1);
          saveToLocalStorage('pick', pickArr);
        }
      }
    } else {
      botSelection = Math.floor(Math.random() * 3 + 1);
      if (botSelection === 1) {
        botSelection = 'rock';
      } else if (botSelection === 2) {
        botSelection = 'paper';
      } else {
        botSelection = 'scissor';
      }
    }

    let userWins = `The opponent has chosen ${botSelection} 🔥 You WIN this round 🔥`;
    let botWins = `The opponent has chosen ${botSelection} 😭 You LOSE this round 😭`;
    let draw = `Both players have chosen ${botSelection} 😶 It's a DRAW 😶`;

    if (botSelection === 'rock') {
      if (pick === 'paper') {
        winner = userWins;
      } else if (pick === 'rock') {
        winner = draw;
      } else {
        winner = botWins;
      }
    } else if (botSelection === 'paper') {
      if (pick === 'scissor') {
        winner = userWins;
      } else if (pick === 'paper') {
        winner = draw;
      } else {
        winner = botWins;
      }
    } else if (botSelection === 'scissor') {
      if (pick === 'rock') {
        winner = userWins;
      } else if (pick === 'scissor') {
        winner = draw;
      } else {
        winner = botWins;
      }
    }
    if (winner === userWins) {
      setRoundWinner(userWins);
    } else if (winner === botWins) {
      setRoundWinner(botWins);
    } else if (winner === draw) {
      setRoundWinner(draw);
    }
    points(winner, userWins, botWins, draw);
  };

  const points = (winner, userWins, botWins, draw) => {
    if (winner === userWins) {
      setLives(lives + 1);
      livesNumRef.current++;
    } else if (winner === botWins) {
      setBotLives(botLives + 1);
      botLivesNumRef.current++;
    } else if (winner === draw) {
      setBotLives(botLives);
      setLives(lives);
    }
    if (livesNumRef.current === 3 || botLivesNumRef.current === 3) {
      if (livesNumRef.current === 3) {
        setResult(' 🏆 Congratulation, you won! 🏆 ');
        setTimeout(() => {
          setResult('');
        }, 2000);
        setBotLives(0);
        setLives(0);
        livesNumRef.current = 0;
        botLivesNumRef.current = 0;
      } else if (botLivesNumRef.current === 3) {
        setResult(' 💩 Sorry, you lose! 💩 ');
        setTimeout(() => {
          setResult('');
        }, 2000);
        setBotLives(0);
        setLives(0);
        livesNumRef.current = 0;
        botLivesNumRef.current = 0;
      }
    }
  };

  const switchComputer = () => {
    setIsRandom(!isRandom);
    if (cpuRandom === 'Random') {
      setCpuRandom('Tactical');
    } else {
      setCpuRandom('Random');
    }
  };

  return (
    <>
      <div className="title">
        <h1>
          Welcome to the greatest game on earth!
          <br />
          Rock, Paper, Scissor!
        </h1>
      </div>
      <div className="mainWrapper">
        <h4 id="result" className="result-display">
          {result}
        </h4>
        <h2 id="start-title">Pick a weapon</h2>
        <ul className="selection">
          <li
            onClick={() => {
              play('rock');
            }}
          >
            <i className="far fa-hand-rock fa-5x"></i>
          </li>
          <li
            onClick={() => {
              play('paper');
            }}
          >
            <i className="far fa-hand-paper fa-5x"></i>
          </li>
          <li
            onClick={() => {
              play('scissor');
            }}
          >
            <i className="far fa-hand-scissors fa-5x"></i>
          </li>
        </ul>
        <div>{roundWinner}</div>
        <div className="score-board">
          <div className="user">
            <div className="wrapper-flex">
              <div>
                <i className="fas fa-user fa-3x"></i>
              </div>
              <div>
                <p>Player 1</p>
              </div>
            </div>
            {livesNumRef.current}
          </div>

          <div className="computer">
            <div className="wrapper-flex">
              <div>
                <i className="fas fa-robot fa-3x"></i>
              </div>
              <div>
                <p id="robot">{cpuRandom}</p>
              </div>
            </div>
            {botLivesNumRef.current}
          </div>
        </div>

        <button
          id="switch"
          className="button-switch"
          onClick={() => switchComputer()}
        >
          Switch Computer player
        </button>
      </div>
    </>
  );
};

export default App;
