import "./styles.css"

interface SnakeProps {
	active?: boolean
}

function Snake({ active }: SnakeProps) {
	return (
		<div className="snake" data-testid="snake">
			<div className={"body " + (active ? "body-active" : "")}></div>
		</div>
	)
}

export default Snake
