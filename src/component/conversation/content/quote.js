import './content.css';
import TextWithEmoji from '../../TextWithEmoji';
import { contactName } from '../../../utils/Chat';
import { AudioIcon, ImageIcon } from '../../Icons';
import OptimizedImage from '../../OptimizedImage';

const Quote = ({ quote, search, setFocus, contacts }) => {

    function fn(time) {
        const z = (t) => t > 9 ? t : '0'+t;
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${z(min)}:${z(sec)}`;
    };

    return (
        <div className='Quote' onClick={() => setFocus(quote._id)}>
            <div className='thread' style={{backgroundColor:quote.senderColor}}></div>
            <div className={`quote_top ${quote.images.length > 0 ? 'withImage' : ''}`}>
                <span className='quote_sender' style={{color:quote.senderColor}}>
                    {contactName(quote.senderId, contacts) || quote.senderPhoneNumber}
                </span>
            </div>
            <div className={`quote ${quote.images.length > 0 ? 'withImage' : ''}`}>
                {!quote.audio  && 
                <div className={`quote__ ${quote.images.length > 0 ? 'withImage' : ''}`}>
                        
                    <div className='quote_message__'>
                        {quote.message ? <TextWithEmoji text={quote.message} font={12} 
                        CLX={'quote_message'} clx={'quote_message-inner'} search={search} /> :
                        <span className='quote_message'>
                            {quote.images.length > 0 ? 'Image' : ''}
                        </span>}
                    </div>

                </div>}
                {quote.audio && <div className='quote__'>
                    <AudioIcon className={'quote_icon'} />
                    <div className='quote_message__'>
                        <span className='quote_message'>
                            Audio {fn(quote.audioDuration)}
                        </span>
                    </div>
                </div>}
            </div>
            {quote.images.length > 0 && <div className='quote_img'>
                <OptimizedImage data={quote.images[0]} />
            </div>}
        </div>
    )
};

export default Quote;