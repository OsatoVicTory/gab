import { useRef, useState, useCallback } from 'react';
// import './modal.css';
import useModal from '../../hooks/useModal';
// import TextWithEmoji from '../../component/TextWithEmoji';
import EmojiRender from '../../component/emoji-store/emojiRender';
import './all_reactions.css';
import { contactName } from '../../utils/Chat';
import { responseMessage } from '../../utils/others';
import { reactDM } from '../../services/dm';
import { setChatsData, setStatusMessageData } from '../../store/actions';
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import defaultImg from '../../images/avatar.png';
import { formatDateTimeFromDate } from '../../utils/formatters';

const AllMessageReactions = ({ pos, closeModal, data, user, acct, socket }) => {

    const modalRef = useRef();
    const { reactions } = data;
    const [index, setIndex] = useState(0);
    const splitEmojis = useCallback(() => {
        const res = [], mp = new Map();
        res[0] = reactions;
        for(const reaction of reactions) {
            mp.set(reaction.emoji, [...(mp.get(reaction.emoji) || []), reaction]);
        };
        for(const r of mp) res.push(r[1]);
        return res;
    }, [reactions.length]);
    const splittedEmoji = splitEmojis();

    const dispatch = useDispatch();
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);

    useModal(modalRef, closeModal);

    const handleRemoveReactionClick = (Id) => {
        if(Id !== user._id) return;
        if(data.audio) {
            setStatusMessage({type:'success',text:'Reaction removed successfully'});
            setChats('removeReaction', user._id, data._id, acct._id);
            socket.emit('removeReaction', {
                senderId: user._id, receiverId: acct._id, messageId: data._id
            });
            return closeModal();
        }
        const reaction = { userId: user._id, emoji: null };
        reactDM(data._id, reaction).then(res => {
            responseMessage('success', setStatusMessage, res);
            setChats('removeReaction', user._id, data._id, acct._id);
            socket.emit('removeReaction', {
                senderId: user._id, receiverId: acct._id, messageId: data._id
            });
            closeModal();
        })
        .catch(err => responseMessage('error', setStatusMessage, err));
    };

    return (
        <div className='all_message_reactions' style={{...pos}}>
            <div className='a_m_r hideModal' ref={modalRef}>
                <div className='a_m_r__header'>
                    <div className={`a_m_r_h__ ${index === 0}`}
                    onClick={() => setIndex(0)}>
                        <span className='txt-14'>All</span>
                        <span className='amrm_count'>{reactions.length}</span>
                    </div>
                    {splittedEmoji.slice(1).map((val, idx) => (
                        <div className={`a_m_r_h__ ${index === idx + 1}`} key={`amr-${idx}`}
                        onClick={() => setIndex(idx + 1)}>
                            <EmojiRender emoji={val[0].emoji} size={18} />
                            <span className='amrm_count'>{val.length}</span>
                        </div>
                    ))}
                </div>
                <div className='a_m_r__main'>
                    {splittedEmoji[index].map((val, idx) => (
                        <div className={`a_m_r_m__ ${val.userId === user._id && 'cursor'}`} 
                        key={`re-${idx}`}
                        onClick={() => handleRemoveReactionClick(val.userId)}>
                            <div className='amrm_image'>
                                <img 
                                src={
                                    (val.userId === user._id ? 
                                    user.img : acct.img) || defaultImg
                                } 
                                alt='reaction' />
                            </div>
                            <div className='amrm_text'>
                                <span className='amrm_userName'>
                                    {
                                        val.userId === user._id ? 
                                        'You' : 
                                        contactName(acct.phoneNumber, user.contacts)
                                    }
                                </span>
                                
                                <span className='amr_span'>
                                    {val.userId === user._id ?
                                    'Click to remove' : 
                                    formatDateTimeFromDate(val.time)}
                                </span>

                            </div>
                            <div className='amrm_emoji'>
                                <EmojiRender emoji={val.emoji} size={35} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default AllMessageReactions;