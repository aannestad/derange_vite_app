import React, { useState, useEffect, useRef, useCallback } from 'react';
import { animated, useSprings } from 'react-spring';
import { Container, Button, Typography, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DerangementChart from './DerangementChart.jsx';
import { IntroTextComponent, OutroTextComponent } from './TextData.jsx';


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
  const [hasShuffled, setHasShuffled] = useState(false);
  const [boardSize, setBoardSize] = useState(3);
  const [outcomes, setOutcomes] = useState([]);
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
    setHasShuffled(true);
    const newShuffledElements = shuffleArray(elements);
    const currentIsDeranged = isDerangement(elements, newShuffledElements);
    setShuffledElements(newShuffledElements);
    setIsDeranged(currentIsDeranged);
    
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

    // Update the outcomes and running average
    setOutcomes(prevOutcomes => {
      const newOutcome = currentIsDeranged ? 0 : 1; // 0 for derangement, 1 for non-derangement
      const totalShuffles = prevOutcomes.length + 1;
      
      // Count non-derangements
      const totalNonDerangements = prevOutcomes.reduce((acc, curr) => acc + curr.outcome, 0) + newOutcome;
      
      const runningAverage = totalNonDerangements / totalShuffles;
      
      return [...prevOutcomes, { 
          shuffle: totalShuffles,
          outcome: newOutcome,
          runningAverage
      }];
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
    <div className="flex flex-col min-h-screen">
      <Container maxWidth="lg">
        <header className="App-header">
          <Typography variant="h4" gutterBottom style={{ color: 'white', fontFamily: 'sans-serif', backgroundColor: '#000080'}}>
            Simulating Derangements
          </Typography>
          <Typography variant="h6" gutterBottom style={{ fontFamily: 'sans-serif' }}>
            <div>By <br></br>  Hans Martin Aannestad</div> 
          </Typography>

          <Container maxWidth="lg">
            <div className="text-justify">
                <IntroTextComponent />
            </div>
          </Container>
          
          <FormControl variant="outlined" className="mb-4" style={{width: 100, marginLeft: '-850px',}}>
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

          <Button 
            variant="contained"
            onClick={shuffle}
            className="mb-4"
            style={{ 
              backgroundColor: '#000080', 
              margin: '0px',
              marginLeft: '10px',
              padding: '16px 20px' 
            }}
            >
            Shuffle
          </Button>

        <Box 
            className="relative w-96 h-96"
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
            marginTop: '50px',

            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            backgroundColor: '#000080',
            fontSize: getFontSize(shuffledElements[index] + 1),
            width: 'clamp(30px, 4vw, 60px)',
            height: 'clamp(30px, 4vw, 60px)',
          }}
        >
          {shuffledElements[index] + 1}
          </animated.div>
        ))}

          </Box>
          {hasShuffled && (
          isDeranged ? (
            <Typography variant="h5" sx={{ color: 'red', fontWeight: 'bold', marginLeft: '-30px' }}>
              This is a Derangement
            </Typography>
          ) : (
            <Typography variant="h5" sx={{ color: 'green', fontWeight: 'bold', marginLeft: '-40px' }}>
              This is not a Derangement
            </Typography>
          )
        )}
        </header>

        <Box 
            sx={{
              width: '700px',   // 100% of viewport width
              height: '600px',   // 60% of viewport height
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <DerangementChart
              outcomes={outcomes.map(o => o.outcome)} 
              runningAverage={outcomes.map(o => o.runningAverage)} 
            />
        </Box>

        <Container maxWidth="lg" sx={{margin: '-80px 0' }}>
            <div className="text-justify">
            <OutroTextComponent />
            </div>
          </Container>

      </Container>
    </div>
  );
}

function App() {
  return <DerangementSim />;
}

export default App;
