import { useCallback, useState } from "react"

const totalBlocks = 225
const initialblocks = Array.apply(null, Array(totalBlocks)).map((_, index) => ({
	id: index,
	apple: false,
	snake: false,
}))

export default function useCreateBlocks() {
	const [blocks, setBlocks] = useState(initialblocks)
	const [appleIndex, setAppleIndex] = useState<number | null>(null)

	document.addEventListener("keydown", function (event) {
		if (event.keyCode === 37) {
		} else if (event.keyCode === 39) {
		}
	})

	const randomApple = useCallback(() => {
		const appleBlock = Math.floor(Math.random() * totalBlocks - 1)
		setAppleIndex(appleBlock)
		setBlocks((prev) => {
			prev[appleBlock].apple = true
			return prev
		})
	}, [])

	const removeApple = useCallback(() => {
		setAppleIndex((appleIndex) => {
			setBlocks((prev) => {
				if (appleIndex) prev[appleIndex].apple = false
				return prev
			})
			return null
		})
	}, [])

	const initSnake = useCallback(() => {
		setBlocks((prev) =>
			prev.map((block, index) =>
				index === 0 ? { ...block, snake: true } : block
			)
		)
	}, [setBlocks])

	const setSnakePositions = useCallback(
		(positions: number[]) => {
			setBlocks((prev) =>
				prev.map((block, index) =>
					positions.includes(index)
						? { ...block, snake: true }
						: { ...block, snake: false }
				)
			)
		},
		[setBlocks]
	)

	return {
		blocks,
		appleIndex,
		randomApple,
		removeApple,
		initSnake,
		setSnakePositions,
	}
}
