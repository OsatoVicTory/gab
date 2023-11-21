import { useRef } from 'react';
import useModal from '../../hooks/useModal';
import EmojiRender from '../../component/emoji-store/emojiRender';
import { PlusFillCircleIcon } from '../../component/Icons';
import './endo.css'; 
import { responseMessage } from '../../utils/others';
import { reactDM } from '../../services/dm';
import { setChatsData, setStatusMessageData } from '../../store/actions';
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

const ReactionsPickerPreview = ({ pos, closeModal, openModal, data, socket, _id, id }) => {

    const reactions = ['🙏', '❤️', '👍', '😢', '😂', '😮'];
    const modalRef = useRef();

    const dispatch = useDispatch();
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);

    useModal(modalRef, closeModal);
    
    const handleSelectedEmoji = (emoji) => {
        const reaction = { userId: _id, emoji, time: String(new Date()) };

        if(data.audio) {
            setStatusMessage({type:'success',text:'Reaction removed successfully'});
            setChats('receiveReaction', _id, data._id, id, reaction);
            socket.emit('reacted', {
                senderId: _id, receiverId: id,
                reaction, messageId: data._id
            });
            return closeModal();
        }

        reactDM(data._id, reaction).then(res => {
            responseMessage('success', setStatusMessage, res);
            setChats('receiveReaction', _id, data._id, id, reaction);
            socket.emit('reacted', {
                senderId: _id, receiverId: id,
                reaction, messageId: data._id
            });
            closeModal();
        })
        .catch(err => responseMessage('error', setStatusMessage, err));    
    };

    return (
        <div className='Reactions_picker_preview' style={{...pos}}>
            <div className='RPP hideModal' ref={modalRef}>
                {reactions.map((val, idx) => (
                    <div className='rpp_div' key={`rpp_${idx}`}
                    onClick={() => handleSelectedEmoji(val)}>
                        <EmojiRender emoji={val} size={32} />
                    </div>
                ))}
                <div className='rpp_div' onClick={(e) => {
                    openModal(e.target, 'reactions_picker', 
                    Math.min(window.innerWidth - 10, 330), 390, false, data);
                }}>
                    <PlusFillCircleIcon className={'rrp_icon'} />
                </div>
            </div>
        </div>
    )
};

export default ReactionsPickerPreview;