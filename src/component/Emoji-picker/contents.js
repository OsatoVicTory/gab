import EmojiRender from '../emoji-store/emojiRender';
import './styles.css'; 
import { MdOutlineArrowRight } from 'react-icons/md';


const EmojiPickerContents = ({ state, emojiListsShowing, handleEmojiClick, rowLength }) => {
    if(state === 'not_loaded') {
        return (<div className='Emoji-picker-contents'>
            <span className='txt-17 grey'>Loading...</span>
        </div>)
    } else {
        return (<div className='Emoji-picker-contents'>
        {emojiListsShowing.map((rows, index) => (
            <div className='Epm_list' key={`epm_list-${index}`}>

                {rows.title && <div className='Epm_list_title'>
                {rows.title.replace('_', ' & ')}</div>}

                <div className='Epm_list_rows' style={{marginTop: '6px'}}>
                    {rows.lists.map((row, idx) => (
                        <div className='Epm_list_row' key={`epm-row-${idx}`}
                        style={{justifyContent: row.length >= rowLength ? 'space-between':'unset' }}>
                            {row.map((item, i) => (
                                <div className='Epm_list_row_item' key={`Elr-${i}`}
                                onClick={(e) => handleEmojiClick(e, item)}>
                                    <EmojiRender emoji={item.emoji} size={32} />
                                    {item.v && <MdOutlineArrowRight className='Epm-icon' />}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        ))}
        </div>)
    }
};

export default EmojiPickerContents;