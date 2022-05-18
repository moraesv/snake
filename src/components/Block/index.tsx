import Apple from '../Apple';
import Snake from '../Snake';
import './styles.css';

interface BlockProps {
    apple?: boolean
    snake?: boolean
}

function Block({ apple, snake }: BlockProps) {
    return (
        <div className="block" data-testid="block">
            {apple && <Apple />}
            {snake && <Snake />}
        </div>
    );
}

export default Block;
