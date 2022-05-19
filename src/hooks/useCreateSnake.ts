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

	const snakeStep = useCallback(() => {
		setSnake((prevSnake) => {
			return { ...prevSnake, position: prevSnake.position + 1 }
		})
	}, [])

	const useInitSnakeStep = () =>
		useEffect(() => {
			const interval = setInterval(() => snakeStep(), 1000)

			return () => clearInterval(interval)
		}, [])

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

	return { snake, useInitSnakeStep, getSnakePositions }
}
