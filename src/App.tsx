import { useEffect } from "react"
import "./App.css"
import Block from "./components/Block"
import useCreateApple from "./hooks/useCreateApple"
import useCreateBlocks from "./hooks/useCreateBlocks"
import useCreateSnake from "./hooks/useCreateSnake"

function App() {
  const { blocks, setSnakePositions, setApplePosition } = useCreateBlocks()
  const { apple, getApplePosition, recreateApple } = useCreateApple()
  const { getSnakePositions } = useCreateSnake({ apple, onColideApple: recreateApple })

  useEffect(() => {
    setSnakePositions(getSnakePositions())
  }, [setSnakePositions, getSnakePositions])

  useEffect(() => {
    setApplePosition(getApplePosition())
  }, [setApplePosition, getApplePosition])

  return (
    <div className="App" data-testid="app">
      <div className="panel">
        {blocks.map((block) => (
          <Block key={block.id} apple={block.apple} snake={block.snake} />
        ))}
      </div>
    </div>
  )
}

export default App
