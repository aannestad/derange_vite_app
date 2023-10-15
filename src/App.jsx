import React, { useState, useEffect, useRef, useCallback } from 'react';
import { animated, useSprings } from 'react-spring';
import { Button, Typography, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function shuffleArray(array) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function isDerangement(original, shuffled) {
  return original.every((val, idx) => val !== shuffled[idx]);
}

function DerangementSim() {
  const [boardSize, setBoardSize] = useState(3);
  const [elements, setElements] = useState([...Array(boardSize * boardSize).keys()]);
  const [shuffledElements, setShuffledElements] = useState(() => shuffleArray(elements));
  const [isDeranged, setIsDeranged] = useState(() => isDerangement(elements, shuffledElements));
  
  const getMarbleSize = (number) => {
    const baseSize = 30; // Base size for one digit
    return `${baseSize + String(number).length * 10}px`; // Increment size for each additional digit
  };

  const getFontSize = (number) => {
    return `${20 + String(number).length}px`; // Adjust the font size dynamically
  };

  const boardRef = useRef(null); 
  
  const getSpringProps = useCallback((index) => {
    if (!boardRef.current) return { top: 0, left: 0 };
    const rect = boardRef.current.getBoundingClientRect();
    const marbleSize = rect.width / boardSize;
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    return { top: row * marbleSize, left: col * marbleSize };
  }, [boardSize]);

  const [springs, setSprings] = useSprings(elements.length, index => getSpringProps(index));

  const shuffle = () => {
    const newShuffledElements = shuffleArray(elements);
    setShuffledElements(newShuffledElements);
    setIsDeranged(isDerangement(elements, newShuffledElements));
    
    setSprings(index => {
      // Getting the original position of the marble.
      const fromProps = getSpringProps(index);
      
      // Getting the new position after shuffle.
      const toProps = getSpringProps(newShuffledElements.indexOf(elements[index]));

      return {
        to: async (next) => {
          // Animating to the new position.
          await next({ ...toProps, transform: 'scale(1)' });
        },
        from: { ...fromProps, transform: 'scale(1.1)' },
        config: { tension: 170, friction: 12, mass: 1 },
        reset: true,
      };
    });
};
  

  useEffect(() => {
    const newElements = [...Array(boardSize * boardSize).keys()];
    setElements(newElements);
    const newShuffledElements = shuffleArray(newElements);
    setShuffledElements(newShuffledElements);
    setIsDeranged(isDerangement(newElements, newShuffledElements));
    setSprings(index => getSpringProps(newShuffledElements.indexOf(newElements[index])));
  }, [boardSize, getSpringProps]);

  return (
    <div className="App p-6">
      <header className="App-header">
        <Typography variant="h4" gutterBottom>
          Derangement Simulator
        </Typography>
        <FormControl variant="outlined" className="mb-4">
          <InputLabel id="board-size-label">Board Size</InputLabel>
          <Select
            labelId="board-size-label"
            id="board-size-select"
            value={boardSize}
            onChange={e => setBoardSize(Number(e.target.value))}
            label="Board Size"
          >
            <MenuItem value={2}>2x2</MenuItem>
            <MenuItem value={3}>3x3</MenuItem>
            <MenuItem value={9}>9x9</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={shuffle} className="mb-4">
          Shuffle
        </Button>

        <Box 
          className="relative w-64 h-64"
          ref={boardRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          }}    
        >

      {springs.map((props, index) => (
        <animated.div
        key={shuffledElements[index]}
        style={{
          ...props,
          position: 'absolute',

          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'gray',
          fontSize: getFontSize(shuffledElements[index] + 1),
          width: 'clamp(30px, 4vw, 60px)',
          height: 'clamp(30px, 4vw, 60px)',
        }}
      >
        {shuffledElements[index] + 1}
        </animated.div>
      ))}
        </Box>
        {isDeranged ? (
      <Typography variant="h5" sx={{ color: 'red', fontWeight: 'bold' }}>
            This is a Derangement
          </Typography>
      ) : (
          <Typography variant="h5" sx={{ color: 'green', fontWeight: 'bold' }}>
            This is not a Derangement
          </Typography>
      )}
      </header>
      
    </div>
  );
}

function App() {
  return <DerangementSim />;
}

export default App;
