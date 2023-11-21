// import emojis from './emojis.json';
// import data from './emoji_data.json';
import emoji_list from './emoji_list.json';
import images from './emoji-images';
import './styles.css';

const Picker = ({ inserter }) => {
    const Emojis = emoji_list;
    /* emojis['smileys_people'].map(val => {
        if(val.v) return val.v.map(e => e);
        else return [val.u];
    }).flat(Infinity); */
    const desired_px = 35;
    const backgroundSize = `${29 * desired_px}px ${14 * desired_px}px`;
  
    const getStyles = (numm) => {
        numm += 1;
        const page = Math.ceil(numm / 406);
        const num = (numm % 406 == 0 && numm) ? 405 : (numm % 406) - 1;
        const left = num && !(num % 29) ? 29 : num % 29;
        const pos = `-${left * desired_px}px -${Math.floor(num / 29) * desired_px}px`;
        let bgSize = backgroundSize;
        if(page == 9) bgSize = `${29 * desired_px}px ${3 * desired_px}px`;
        return { 
            fontSize: `${desired_px}px`, backgroundSize: bgSize,
            width: `${desired_px}px`, height: `${desired_px}px`, 
            backgroundImage: `url(${images[page]})`, backgroundPosition: pos,  
        };
    };

    const RenderEmoji = ({ value, index }) => {
        const emoji = String.fromCodePoint(parseInt(value.code, 16));
        const styles = getStyles(index);
        return <span className='epl_div' style={styles}>{emoji}</span>;
    };

    const clicked = (code) => {
        const hexUnits = code.split('-').filter(c => c).map(hex => parseInt(hex, 16));
        const emoji = String.fromCodePoint(...hexUnits);
        inserter(emoji);
    };

    return (
        <div className='Emoji-picker'>
            <div className='emoji-picker-lists'>
                {Emojis.map((val, idx) => (
                    <div className='epl-div-main' 
                    onClick={() => clicked(val.code)} key={`em-${idx}`}>
                        <RenderEmoji value={val} index={idx} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Picker;