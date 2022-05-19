import { useCallback, useEffect, useState } from "react"

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
	const [snakeStepInterval, setSnakeStepInterval] = useState<NodeJS.Timer>()

	const snakeStep = useCallback(() => {
		setSnake((prevSnake) => {
			let position = 1
			switch (prevSnake.direction) {
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

			return { ...prevSnake, position: prevSnake.position + position }
		})
	}, [])

	const changeSnakeDirection = useCallback((direction: Snake["direction"]) => {
		setSnake((prevSnake) => {
			return { ...prevSnake, direction }
		})
	}, [])

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

	const useInitSnakeStep = () => {
		useEffect(() => {
			const interval = setInterval(() => snakeStep(), 800)
			setSnakeStepInterval(interval)

			return () => {
				clearInterval(interval)
			}
		}, [])
	}

	const useHandleInput = () => {
		useEffect(() => {
			document.addEventListener("keydown", handleKeys)

			return () => {
				document.removeEventListener("keydown", handleKeys)
			}
		}, [])
	}

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

	return { snake, useInitSnakeStep, useHandleInput, getSnakePositions }
}
