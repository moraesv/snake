import { useCallback, useEffect, useState } from "react"

export default function useCreateApple() {
	const [apple, setApple] = useState<number | null>(null)

	const randomApple = useCallback(() => {
		const appleIndex = Math.floor(Math.random() * (225 - 1))
		setApple(appleIndex)
	}, [])

	const removeApple = useCallback(() => {
		setApple(null)
	}, [])

	const getApplePosition = useCallback(() => apple, [apple])

	const recreateApple = useCallback(() => {
		removeApple()
		randomApple()
	}, [removeApple, randomApple])

	useEffect(() => {
		randomApple()
		return () => removeApple()
	}, [randomApple, removeApple])

	return { apple, randomApple, removeApple, recreateApple, getApplePosition }
}
