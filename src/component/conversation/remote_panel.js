import { useRef } from 'react';
import { DropDownIcon, EmojiFillIcon } from '../Icons';
import MessageContent from './content';
import './conversation.css';

const ConversationByOthers = ({ 
    search, message, openModal, setFocus,
    notSameSender, getImg 
}) => {

    const messageRef = useRef();

    return (
        <div className='conversation_by_others'>
            <div className='conversation_contents_by_others'>
                <div className='Message__Div'>
                    <MessageContent search={search}
                    message={message} openModal={openModal} getImg={getImg}
                    setFocus={setFocus} notSameSender={notSameSender} />
                </div>
                {!message.isDeleted && <div className='message_options' ref={messageRef}>
                    <div className='m_o_d'  onClick={() => {
                        openModal(messageRef.current, 'dropdown', 240, 240, true, message);
                    }}>
                        <DropDownIcon className={'m_o_d__icon'} />
                    </div>
                    <div className='m_o_e' onClick={(e) => {
                        openModal(messageRef.current, 
                            'reactions_picker_preview', 280, 57, false, message
                        );
                    }}>
                        <EmojiFillIcon className={'m_o_e__icon'} />
                    </div>
                </div>}
            </div>
        </div>
    )
};

export default ConversationByOthers;