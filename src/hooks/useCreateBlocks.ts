import { useCallback, useState } from "react"

const initialblocks = Array.apply(null, Array(400)).map((_, index) => ({ id: index, apple: false, snake: false }))


export default function useCreateBlocks() {
    const [blocks, setBlocks] = useState(initialblocks)
    const [appleIndex, setAppleIndex] = useState<number | null>(null)
    const [snakeHeadPosition, setSnakeHeadPosition] = useState<number>()

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 37) {
            alert('Left was pressed');
        }
        else if (event.keyCode == 39) {
            alert('Right was pressed');
        }
    });

    const randomApple = useCallback(() => {
        const appleBlock = Math.floor(Math.random() * (399))

        setAppleIndex(appleIndex => {
            if (appleIndex === null) {
                setBlocks(prev => prev.map((block, index) =>
                    index === appleBlock ?
                        ({ ...block, apple: true })
                        :
                        block
                ))
            }
            return appleBlock
        })
    }, [])

    const initSnake = useCallback(() => {
        setBlocks(prev => prev.map((block, index) =>
            index === 0 ?
                ({ ...block, snake: true })
                :
                block
        ))
    }, [setBlocks])

    return { blocks, appleIndex, randomApple, initSnake }
}