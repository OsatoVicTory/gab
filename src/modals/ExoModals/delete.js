import { useState, useRef } from 'react';
import "./modal_styles.css";
import { CloseIcon } from '../../component/Icons';
import { setChatsData, setStatusMessageData } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteDirectMessageForAll, deleteDirectMessageForMe } from '../../services/dm';
import { responseMessage } from '../../utils/others';
import useClickOutside from '../../hooks/useClickOutside';

const DeleteModal = ({ message, socket, closeModal }) => {
    
    const modalRef = useRef();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const setStatusMessage = bindActionCreators(setStatusMessageData, dispatch);
    const setChats = bindActionCreators(setChatsData, dispatch);

    const handleDelete = (type) => {
        if(deleteLoading || (!message?._id && !message?.messageIds)) return;
        setDeleteLoading(type);
        const fn = (type === 'me' ? deleteDirectMessageForMe : deleteDirectMessageForAll);

        const setter = setChats;

        const ids = (message?.messageIds||[message._id]);
        const id = (message.receiverId !== user._id ? message.receiverId : message.senderId);
        // 36, 24

        if(type === 'everyone' && message._id.length > 24) {
            socket.emit('deletedMessage', {
                receiverId: id,
                deleterId: user._id,
                messageId: message._id
            });
            setter('deleteMessage', [message._id], id);
            setStatusMessage({type:'success',text:'Message deleted successfully'});
            setDeleteLoading(false);
            return closeModal();
        }

        const backendIds = ids.filter(_id => _id.length <= 24);

        (type !== 'everyone' ? fn(id, { ids: backendIds }) : fn(message._id)).then(res => {
            if(type === 'everyone') {
                socket.emit('deletedMessage', {
                    receiverId: id,
                    deleterId: user._id,
                    messageId: message._id
                });
                setter('deleteMessage', [message._id], id);
            } else {
                setter('deleteMessage', ids, id); 
            }
            responseMessage('success', setStatusMessage, res);
            setDeleteLoading(false);
            closeModal();
        }).catch(err => {
            responseMessage('error', setStatusMessage, err);
            setDeleteLoading(false);
        });
    };

    useClickOutside(modalRef, () => closeModal());

    return (
        <div className='ActionModal' ref={modalRef}>
            <div className='actionModal__Content'>
                <div className='actionModal__Header'>
                    <span className='txt-17'>Delete</span>
                    <div className='actionModal__Close' onClick={() => closeModal()}>
                        <CloseIcon className={'action-close-icon'} />
                    </div>
                </div>
                <span className='txt-14 action_span'>Delete message for me or everyone ?</span>
                <div className='actionModal__Base'>
                    <div className='action_modal_white_border' 
                    onClick={() => handleDelete('me')}>
                        <span className='txt-14 bold'>
                            {deleteLoading === 'me' ? 'Deleting...' : 'For me'}
                        </span>
                    </div>
                    {(!message.messageIds && message?.senderId === user._id) && 
                    <div className='action_modal_green_border' 
                    onClick={() => handleDelete('everyone')}>
                        <span className='txt-14 bold'>
                            {deleteLoading === 'everyone' ? 'Deleting...' : 'For everyone'}
                        </span>
                    </div>}
                </div>
            </div>
        </div>
    )
};

export default DeleteModal;