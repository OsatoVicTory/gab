import { useEffect, useRef, useState } from 'react';
import useModal from '../../hooks/useModal';
import './endo.css';
import EmojiPicker from '../../component/Emoji-picker';
import { responseMessage } from '../../utils/others';
import { reactDM } from '../../services/dm';
import { setChatsData, setStatusMessageData } from '../../store/actions';
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

const ReactionsPicker = ({ pos, closeModal, data, socket, _id, id }) => {

    
    const modalRef = useRef();
    const eleRef = useRef();
    const [offsetWidth, setOffsetWidth] = useState(0);

    const dispatch = useDispatch();
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);

    useModal(modalRef, closeModal);

    useEffect(() => {
        let id;
        if(eleRef.current) id = setTimeout(() => setOffsetWidth(eleRef.current.offsetWidth), 0);
        return () => clearTimeout(id);
    }, []);
    
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
        <div className='Reactions__Picker' style={{...pos}} ref={eleRef}>
            <div className='Reactions_Picker hideModal' ref={modalRef}>
                {offsetWidth && <EmojiPicker offsetWidth={offsetWidth} 
                emojiClick={handleSelectedEmoji} />}
            </div>
        </div>
    )
};

export default ReactionsPicker;