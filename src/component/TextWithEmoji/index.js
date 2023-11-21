import { useEffect, useRef } from 'react';
import './styles.css';
import { formatTextForEmojisAndMatchSearch, formatTextForEmojis } from '../../utils/texts';

const TextWithEmoji = ({ text, CLX, clx, font, search }) => {
    const textRef = useRef();

    useEffect(() => {
        if(textRef.current) {
            if(search !== null) {
                const srch = search.split(' ').filter(c => c).map(c => c.toLowerCase());
                textRef.current.innerHTML = formatTextForEmojisAndMatchSearch(
                    text, clx, font, srch
                );
            } else {
                textRef.current.innerHTML = formatTextForEmojis(text, clx, font);
            }
        }
    }, [text, search]);

    return (
        <span className={`${CLX} em-text`} ref={textRef}></span>
    )
};

export default TextWithEmoji;