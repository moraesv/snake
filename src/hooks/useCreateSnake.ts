import { useCallback, useEffect, useRef, useState } from "react"

interface CreateSnakeProps {
	apple: number | null
	onColideApple: () => void
}

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

export default function useCreateSnake({
	apple,
	onColideApple,
}: CreateSnakeProps) {
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

	function checkDirection(
		actualDirection: Snake["direction"],
		newDirection: Snake["direction"]
	) {
		if (actualDirection === newDirection) return false
		switch (newDirection) {
			case "up":
				if (actualDirection === "down") return false
				break
			case "down":
				if (actualDirection === "up") return false
				break
			case "left":
				if (actualDirection === "right") return false
				break
			case "right":
				if (actualDirection === "left") return false
				break
			default:
				return false
		}
		return true
	}

	const propagateStep = useCallback(
		(
			node: Snake,
			toPosition: number,
			toDirection: Snake["direction"]
		): Snake => {
			let next: Snake | undefined
			if (node.next)
				next = propagateStep(node.next, node.position, node.direction)

			return {
				...node,
				position: toPosition,
				direction: toDirection,
				next: next,
			}
		},
		[]
	)

	const stopStepInterval = useCallback(() => {
		clearInterval(snakeStepInterval.current)
	}, [])

	const checkColideBorders = useCallback(
		(nextPosition: number, direction: Snake["direction"]) => {
			if (nextPosition % 15 === 0 && direction === "right") {
				stopStepInterval()
				return true
			}
			if (nextPosition % 15 === 14 && direction === "left") {
				stopStepInterval()
				return true
			}
			if (nextPosition < 0 && direction === "up") {
				stopStepInterval()
				return true
			}
			if (nextPosition > 224 && direction === "down") {
				stopStepInterval()
				return true
			}
		},
		[stopStepInterval]
	)

	const snakeStep = useCallback(() => {
		setSnake((prevSnake) => {
			const position = getPosition(prevSnake.direction)
			const nextPosition = prevSnake.position + position

			if (checkColideBorders(nextPosition, prevSnake.direction))
				return prevSnake

			let next: Snake | undefined
			if (prevSnake.next)
				next = propagateStep(
					prevSnake.next,
					prevSnake.position,
					prevSnake.direction
				)

			return {
				...prevSnake,
				position: nextPosition,
				next: next,
			}
		})
	}, [propagateStep, checkColideBorders])

	const startStepInterval = useCallback(() => {
		const interval = setInterval(() => snakeStep(), 500)
		snakeStepInterval.current = interval
	}, [snakeStep])

	const changeSnakeDirection = useCallback(
		(direction: Snake["direction"]) => {
			setSnake((prevSnake) => {
				if (!checkDirection(prevSnake.direction, direction)) return prevSnake

				const position = getPosition(direction)
				const nextPosition = prevSnake.position + position

				if (checkColideBorders(nextPosition, prevSnake.direction))
					return prevSnake

				stopStepInterval()

				let next: Snake | undefined
				if (prevSnake.next)
					next = propagateStep(
						prevSnake.next,
						prevSnake.position,
						prevSnake.direction
					)

				startStepInterval()

				return {
					...prevSnake,
					direction,
					position: nextPosition,
					next: next,
				}
			})
		},
		[startStepInterval, stopStepInterval, propagateStep, checkColideBorders]
	)

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

	const addNode = useCallback(() => {
		setSnake((prev) => {
			function loop(node: Snake): Snake {
				if (node.next) {
					return {
						...node,
						next: loop(node.next),
					}
				}

				return {
					...node,
					next: {
						node: node.node + 1,
						position: node.position,
						active: false,
						direction: "right",
						next: undefined,
					},
				}
			}

			return loop(prev)
		})
	}, [setSnake])

	const checkColideSelf = useCallback(() => {
		const positions = getSnakePositions().slice(2)

		if (positions.includes(snake.position)) {
			stopStepInterval()
		}
	}, [snake, getSnakePositions, stopStepInterval])

	useEffect(() => {
		startStepInterval()
		return () => stopStepInterval()
	}, [startStepInterval, stopStepInterval])

	useEffect(() => {
		document.addEventListener("keydown", handleKeys)
		return () => document.removeEventListener("keydown", handleKeys)
	}, [handleKeys])

	useEffect(() => {
		if (snake.position === apple) {
			onColideApple()
			addNode()
		}
	}, [snake, apple, onColideApple, addNode])

	useEffect(() => {
		checkColideSelf()
	}, [checkColideSelf])

	return { snake, getSnakePositions }
}
