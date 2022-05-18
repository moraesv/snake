import { useEffect } from 'react';
import './App.css';
import Block from './components/Block';
import useCreateBlocks from './hooks/useCreateBlocks';


function App() {
  const { blocks, randomApple, initSnake } = useCreateBlocks()

  useEffect(() => {
    randomApple()
  }, [randomApple])

  useEffect(() => {
    initSnake()
  }, [initSnake])

  return (
    <div className="App" data-testid="app">
      <div className="panel">
        {blocks.map(block =>
          <Block key={block.id} apple={block.apple} snake={block.snake} />
        )}
      </div>
    </div>
  );
}

export default App;
