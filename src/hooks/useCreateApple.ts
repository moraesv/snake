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

	const useInitApple = () =>
		useEffect(() => {
			randomApple()
			return () => removeApple()
		}, [])

	return { apple, randomApple, removeApple, getApplePosition, useInitApple }
}
