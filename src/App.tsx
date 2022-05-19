import { useEffect } from "react"
import "./App.css"
import Block from "./components/Block"
import useCreateBlocks from "./hooks/useCreateBlocks"
import useCreateSnake from "./hooks/useCreateSnake"

function App() {
	const { blocks, randomApple, removeApple, initSnake, setSnakePositions } =
		useCreateBlocks()
	const { snake, useInitSnakeStep, getSnakePositions } = useCreateSnake()

	useEffect(() => {
		randomApple()
		return () => removeApple()
	}, [randomApple, removeApple])

	useEffect(() => {
		initSnake()
	}, [initSnake])

	useEffect(() => {
		setSnakePositions(getSnakePositions())
	}, [setSnakePositions, getSnakePositions])

	useInitSnakeStep()

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
