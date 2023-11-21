import { useState } from 'react';
import TextWithEmoji from "../../TextWithEmoji";
import { DeliveredIcon, SentIcon } from '../../Icons';
import EmojiRender from '../../emoji-store/emojiRender';
import Quote from './quote';
import Scrapped from './scrapped';
import WavePlayer from "../../wave_player";
import { formatTimeFromDate } from '../../../utils/formatters';
import { useSelector } from "react-redux";
import MessageImage from "./image";
import Link from './link';
import StatusTagged from "./status_tagged";
import { BiBlock } from 'react-icons/bi';

const MessageContent = ({ 
    search, message, openModal, setFocus, notSameSender, type, getImg 
}) => {

    const reactions = message?.reactions||[];
    const { contacts } = useSelector(state => state.user);
    const [fullText, setFullText] = useState(
        message.message ? message.message.length <= 1290 : true
    );

    return (
        <div className='MessageContent'>
            <div className={`message_content ${notSameSender ? 'arrow' : ''}`}>
                <div className='message_content_body'>
                    {!message.isDeleted && <div className='Message'>

                        {message.tagged && <Quote quote={message.tagged} 
                        setFocus={setFocus} contacts={contacts} search={search} />}

                        {message.status_tagged &&
                        <StatusTagged quote={message.status_tagged} search={search} />}

                        {message.scrappedData && <Scrapped data={message.scrappedData} />}

                        {message.images?.length > 0 && <MessageImage message={message} />}

                        {message.link && <Link data={message} />}

                        {message.message && <div 
                        className={`Message__Text ${fullText ? 'auto' : 'clip'}`}>
                            <TextWithEmoji text={message.message} font={14.1} 
                            CLX={'message_text'} clx={'msg-inner'} search={search} />
                            {!fullText && <span className='message_text Message_read_more'
                            onClick={() => setFullText(true)}>
                            Read more</span>}
                            <span className='message_text_placeholder'
                            style={{width: `${(message.edited?114:55) - (type!=='You'?20:0)}px`}}>
                            ------</span>
                        </div>}

                        {message.audio && <WavePlayer waveColor={'#A5A4A4'} _id={message._id}
                        audio={message.audio} userImg={getImg(message.senderId)}
                        audioDuration={message.audioDuration} progressColor={'#B4K2A2'} />}

                    </div>}

                    {message.isDeleted && <div className='Message'>
                        <div className='Message__Text isDeleted'>
                            <BiBlock className='isDeleted_icon' />
                            <span className='message_text'>This message was deleted</span>
                            <span className='message_text_placeholder'
                            style={{width: type!=='You'?'35px':'55px'}}>
                            ------</span>
                        </div>
                    </div>}

                </div>
                <div className='message_content_base'>
                    <span className='txt-13'>
                        {(!message.edited || message.isDeleted) ? 
                        formatTimeFromDate(message.createdAt) :
                        `Edited at ${formatTimeFromDate(message.edited)}`}
                    </span>

                    {type !== 'You' ? '' :
                    ( message.isRead ? <DeliveredIcon className={'msg-feedback-icon blue'} /> :
                    message.isDelivered ? <DeliveredIcon className={'msg-feedback-icon'} /> :
                    <SentIcon className={'msg-feedback-icon'} /> )
                    }

                </div>
            </div>
            {reactions.length > 0 && <div className='message_content_reactions'>
                <div className='message_reactions_preview' onClick={(e) => {
                    openModal(e.target, 'all_message_reactions', 
                    Math.min(window.innerWidth - 10, 330), 190, false, message);
                }}>
                    <div className='msg-reactions'>
                        {reactions.map((val, idx) => (
                            <div className='msg-reaction' key={`msgr-${idx}`}>
                                <EmojiRender emoji={val.emoji} size={21} />
                            </div>
                        ))}
                    </div>
                    {reactions.length>1 && <span className='txt-14'>{reactions.length}</span>}
                </div>
            </div>}
        </div>
    )
};

export default MessageContent;