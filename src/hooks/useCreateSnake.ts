import { useCallback, useEffect, useRef, useState } from "react"

interface Snake {
	node: number
	position: number
	active: boolean
	direction: "up" | "down" | "left" | "right"
	next?: Snake
}

const initialSnake: Snake = {
	node: 0,
	position: 0,
	active: false,
	direction: "right",
	next: undefined,
}

export default function useCreateSnake() {
	const [snake, setSnake] = useState(initialSnake)
	const snakeStepInterval = useRef<NodeJS.Timer>()

	function getPosition(direction: Snake["direction"]) {
		let position = 1
		switch (direction) {
			case "up":
				position = -15
				break
			case "down":
				position = 15
				break
			case "left":
				position = -1
				break
			case "right":
				position = 1
				break
			default:
				break
		}
		return position
	}

	function checkDirection(actualDirection: Snake["direction"], newDirection: Snake["direction"]) {
		if (actualDirection === newDirection) return false
		switch (newDirection) {
			case "up":
				if (actualDirection === 'down')
					return false
				break
			case "down":
				if (actualDirection === 'up')
					return false
				break
			case "left":
				if (actualDirection === 'right')
					return false
				break
			case "right":
				if (actualDirection === 'left')
					return false
				break
			default:
				return false
		}
		return true
	}

	const snakeStep = useCallback(() => {
		setSnake((prevSnake) => {
			const position = getPosition(prevSnake.direction)
			return { ...prevSnake, position: prevSnake.position + position }
		})
	}, [])

	const startStepInterval = useCallback(() => {
		const interval = setInterval(() => snakeStep(), 800)
		snakeStepInterval.current = interval
	}, [snakeStep])

	const stopStepInterval = useCallback(() => {
		clearInterval(snakeStepInterval.current)
	}, [])

	const changeSnakeDirection = useCallback((direction: Snake["direction"]) => {
		setSnake((prevSnake) => {
			if (!checkDirection(prevSnake.direction, direction))
				return prevSnake

			stopStepInterval()

			const position = getPosition(direction)

			startStepInterval()

			return { ...prevSnake, direction, position: prevSnake.position + position }
		})
	}, [startStepInterval, stopStepInterval])

	const handleKeys = useCallback(
		(event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowUp":
					changeSnakeDirection("up")
					break
				case "ArrowDown":
					changeSnakeDirection("down")
					break
				case "ArrowLeft":
					changeSnakeDirection("left")
					break
				case "ArrowRight":
					changeSnakeDirection("right")
					break
				default:
					break
			}
		},
		[changeSnakeDirection]
	)

	const getSnakePositions = useCallback(() => {
		const positions = []
		let current = snake
		positions.push(current.position)
		while (current.next) {
			current = current.next
			positions.push(current.position)
		}
		return positions
	}, [snake])

	useEffect(() => {
		startStepInterval()
		return () => stopStepInterval()
	}, [startStepInterval, stopStepInterval])

	useEffect(() => {
		document.addEventListener("keydown", handleKeys)
		return () => document.removeEventListener("keydown", handleKeys)
	}, [handleKeys])

	return { snake, getSnakePositions }
}
