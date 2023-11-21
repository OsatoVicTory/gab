import './emoji-styles.css';
import { getEmojiStylesForOne } from './util';

const EmojiRender = ({ emoji, size }) => {
    return (
        <span className='emojiRender' style={getEmojiStylesForOne(emoji, size)}>
            <span>{emoji}</span>
        </span>
    )
};

export default EmojiRender;